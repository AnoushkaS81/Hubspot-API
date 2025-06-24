# HubSpot API Integration

This project provides a serverless API hosted on Vercel to handle contact form submissions and sync data with HubSpot CRM. It creates or updates contacts and deals based on form input, and supports UTM tracking for Google Ads optimization via Google Tag Manager.

## Features

- **HubSpot Sync**: Searches and updates existing HubSpot contacts by email, or creates new contacts and deals.
- **UTM Tracking**: Captures UTM parameters from the URL and stores them in sessionStorage.
- **Google Tag Manager Integration**: Pushes contact and UTM data to the `dataLayer` for use in Google Ads tracking and analytics.
- **Dummy Frontend Handler**: A sample `form-handler.js` is included to simulate and demonstrate how to collect form data and trigger the API.
- **CORS Support**: Allows requests from your frontend domain.
- **Logs API activity and errors** for debugging.

## Deployment

This API is deployed as a serverless function on [Vercel](https://vercel.com/).

## Usage

1. Deploy the API to Vercel.
2. Set your HubSpot API token as an environment variable in the Vercel dashboard: `HUBSPOT_TOKEN`.
3. Use the included `form-handler.js` in your frontend to simulate a form and capture data.
4. On form submission, data and UTM parameters are sent to the API, which:
   - Creates or updates the contact and deal in HubSpot.
   - Pushes the event and data to the `dataLayer` for Google Tag Manager.

## Environment Variables

- `HUBSPOT_TOKEN`: Your HubSpot private API access token.

## Security

- Do **not** expose your HubSpot token publicly.
- Use Vercel's Environment Variables or a secret management system to store sensitive data.

## License

MIT License
