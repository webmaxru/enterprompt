import React from 'react';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import {
  ReactPlugin,
  withAITracking,
} from '@microsoft/applicationinsights-react-js';
const reactPlugin = new ReactPlugin();
// Add the Click Analytics plug-in.
/* var clickPluginInstance = new ClickAnalyticsPlugin();
   var clickPluginConfig = {
     autoCapture: true
}; */
const appInsights = new ApplicationInsights({
  config: {
    connectionString: process.env.NEXT_PUBLIC_APP_INSIGHT,
    extensions: [reactPlugin],
    extensionConfig: {},
    enableAutoRouteTracking: true,
    disableAjaxTracking: false,
    autoTrackPageVisitTime: true,
    enableCorsCorrelation: true,
    enableRequestHeaderTracking: true,
    enableResponseHeaderTracking: true,
    disableFetchTracking: false,
    disableCookiesUsage: true,
  },
});
appInsights.loadAppInsights();

export { reactPlugin, appInsights };
