import { TelemetryClient } from "@azure/monitor-opentelemetry-exporter";

export const telemetryClient = new TelemetryClient({ instrumentationKey: process.env.APP_INSIGHTS_KEY });
