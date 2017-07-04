import { ErrorHandler } from '@angular/core';
import * as Raven from 'raven-js';

export function ravenInstall(sentryDSN: string) {
    Raven.config(
        sentryDSN,
        {
            /**
             * Clear the path filename to allow Sentry to use map.js file
             *
             * @see https://gonehybrid.com/how-to-log-errors-in-your-ionic-2-app-with-sentry/
             */
            dataCallback: data => {
                if (data.culprit) {
                    data.culprit = data.culprit.substring(data.culprit.lastIndexOf('/'));
                }

                var stacktrace = data.stacktrace || data.exception && data.exception.values[0].stacktrace;

                if (stacktrace) {
                    stacktrace.frames.forEach(frame => {
                        frame.filename = frame.filename.substring(frame.filename.lastIndexOf('/'));
                    });
                }
            }
        }
    ).install();
}

export class RavenErrorHandler implements ErrorHandler {
    handleError(err: any) : void {
        Raven.captureException(err.originalError);
    }
}