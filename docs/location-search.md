# Location Search Component

The LocationSearch component provides a searchable dropdown for location data using the [OpenCage Geocoding API](https://opencagedata.com/).

## Setup

1. Sign up for a free API key at [OpenCage](https://opencagedata.com/)
2. Create a `.env.local` file in the root of your project and add your API key:
```
NEXT_PUBLIC_OPENCAGE_API_KEY=your_api_key_here
```
3. Restart your development server to load the environment variables

## Features

- Real-time location search as you type
- Browser geolocation support with "Use current location" button
- Fallback to basic options ("Remote", "Hybrid") if API is unavailable
- Support for keyboard navigation (arrow keys, enter to select)
- Loading state during API requests
- Smart handling of work arrangement types (Remote, Hybrid)
- Smooth animations and transitions for better UX

## Usage

```jsx
import LocationSearch from '@/app/components/LocationSearch';

// In your form component
<LocationSearch
  value={profile.currentLocation || ''}
  onChange={(value) => updateProfile({ currentLocation: value })}
  placeholder="City, State or Remote"
  required={true}
/>
```

## Current Location Detection

The component includes a "Use current location" button that appears when the input field is focused. This feature:

1. Uses the browser's Geolocation API to get the user's coordinates
2. Performs reverse geocoding to convert the coordinates to a readable address
3. Provides clear error messages when location access is denied or unavailable

Note: For the current location feature to work, the site must be served over HTTPS, and users must grant location access permissions when prompted by their browser.

## API Options

The component accepts the following props:

| Prop | Type | Description | Default |
|------|------|-------------|---------|
| value | string | Current input value | '' |
| onChange | function | Callback when value changes | required |
| id | string | Input id attribute | 'currentLocation' |
| name | string | Input name attribute | 'currentLocation' |
| label | string | Label text | 'Current Location' |
| required | boolean | Whether field is required | false |
| placeholder | string | Input placeholder text | 'Enter your location' |

## Customization

To customize the appearance of the dropdown or suggestions, modify the component's Tailwind classes in `src/app/components/LocationSearch.tsx`.

## Troubleshooting

If location suggestions don't appear:

1. Check that your API key is correctly set in `.env.local`
2. Verify your network connection
3. Check browser console for errors
4. The API has usage limits on the free tier (2,500 requests/day)

If the current location feature doesn't work:

1. Ensure your site is served over HTTPS
2. Check that location permissions are enabled in your browser
3. Verify that the Geolocation API is supported in your browser
4. Try disabling any browser extensions that might block location access

## Without API Key

If no API key is provided, the component will fall back to using mock location data for development and testing purposes. 