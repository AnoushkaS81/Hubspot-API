import axios from "axios";

export default async function handler(req, res) {

  // Set CORS headers
 res.setHeader('Access-Control-Allow-Origin', 'your-domain.com'); 
 res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
 res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

 // Handle preflight OPTIONS request
 if (req.method === 'OPTIONS') {
   return res.status(200).end();
 }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { email, firstname, lastname, phone, company, message } = req.body;
  const hubspotToken = process.env.HUBSPOT_TOKEN;

  try {
    let contactId;

    // 1. Search for existing contact by email
    const searchResponse = await axios.post(
      "https://api.hubapi.com/crm/v3/objects/contacts/search",
      {
        filterGroups: [
          {
            filters: [{ propertyName: "email", operator: "EQ", value: email }]
          }
        ],
        properties: ["email"]
      },
      {
        headers: {
          Authorization: `Bearer ${hubspotToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (searchResponse.data.results.length > 0) {
      contactId = searchResponse.data.results[0].id;

      await axios.patch(
        `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`,
        {
          properties: {
            firstname,
            lastname,
            phone,
            company,
            ...(message && { message }),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${hubspotToken}`,
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      // Contact doesn't exist — create it
      const contactResponse = await axios.post(
        "https://api.hubapi.com/crm/v3/objects/contacts",
        {
          properties: {
            email,
            firstname,
            lastname,
            phone,
            company,
            ...(message && { message }),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${hubspotToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      contactId = contactResponse.data.id;
    }

    // 2. Create deal
    const dealResponse = await axios.post(
      "https://api.hubapi.com/crm/v3/objects/deals",
      {
        properties: {
          dealname: `${firstname} ${lastname} `,
          pipeline: "YOUR_PIPELINE_ID",
          dealstage: "YOUR_STAGE_ID",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${hubspotToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const dealId = dealResponse.data.id;

    // 3. Associate deal with contact
    await axios.put(
      `https://api.hubapi.com/crm/v3/objects/deals/${dealId}/associations/contacts/${contactId}/3`,
      {},
      {
        headers: {
          Authorization: `Bearer ${hubspotToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json({
      message: "Contact and deal created/updated and associated successfully",
      deal: dealResponse.data
    });

  } catch (error) {
    console.error("🔴 ERROR:", error.response?.data || error.message);
    return res.status(500).json({ error: "Error creating or updating contact or deal" });
  }
}
