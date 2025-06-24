<script>
document.addEventListener('DOMContentLoaded', () => {
  console.log('Script loaded');

  setTimeout(() => {
    const form = document.querySelector('form.react-form-contents');
    console.log('Form found:', form);

    if (!form) {
      console.error('Form not found! Available forms:', document.querySelectorAll('form'));
      return;
    }


    const urlParams = new URLSearchParams(window.location.search);
    const utmData = {
      utm_source: urlParams.get('utm_source') || sessionStorage.getItem('utm_source') || '',
      utm_medium: urlParams.get('utm_medium') || sessionStorage.getItem('utm_medium') || '',
      utm_campaign: urlParams.get('utm_campaign') || sessionStorage.getItem('utm_campaign') || '',
      utm_term: urlParams.get('utm_term') || sessionStorage.getItem('utm_term') || '',
      utm_content: urlParams.get('utm_content') || sessionStorage.getItem('utm_content') || ''
    };

    console.log('UTM Data:', utmData);

    Object.entries(utmData).forEach(([key, value]) => {
      if (value) sessionStorage.setItem(key, value);
    });

    form.addEventListener('submit', async (e) => {
      console.log('Form submit event triggered');
      e.preventDefault();

      const formData = {
        firstname: form.querySelector('input[name]')?.value.trim() || '',
        lastname: form.querySelector('input[name]')?.value.trim() || '',
        phone: form.querySelector('input[phone]')?.value.trim() || '',
        company: form.querySelector('input[company]')?.value.trim() || '',
        email: form.querySelector('input[email]')?.value.trim() || '',
        message: form.querySelector('input[message]')?.value.trim() || ''
      };

      console.log('Form data collected:', formData);

      try {
        console.log('Sending to HubSpot...');
        const response = await fetch('https://your-api-endpoint.com/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const responseText = await response.text();
        console.log('HubSpot response text:', responseText);
        console.log('HubSpot response status:', response.status, response.ok);

        if (!response.ok) throw new Error('Failed to send form data');

        console.log('Success path reached — pushing to dataLayer...');

        // Push to dataLayer
        window.dataLayer = window.dataLayer || [];
        const dataLayerEvent = {
          event: 'contact_form_submit',
          user_data: {
            email_address: formData.email,
            phone_number: formData.phone,
            first_name: formData.firstname,
            last_name: formData.lastname
          },
          utm_source: utmData.utm_source,
          utm_medium: utmData.utm_medium,
          utm_campaign: utmData.utm_campaign,
          utm_term: utmData.utm_term,
          utm_content: utmData.utm_content,
          page_url: window.location.href,
          timestamp: new Date().toISOString()
        };

        console.log('DataLayer event:', dataLayerEvent);
        window.dataLayer.push(dataLayerEvent);
        console.log('DataLayer after push:', window.dataLayer);

        form.reset();
        console.log('Form reset complete');
      } catch (error) {
        console.error('Form submission error:', error);
      }
    });

    console.log('Event listener attached to form');
  }, 500);
});
</script>
