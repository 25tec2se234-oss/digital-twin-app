/**
 * Digital Twin Verse (DTV) — Privacy-Preserving Product Analytics Engine
 * Provides structured product funnel telemetry for GA4 and server-side retention logs.
 * Enforces strict PII scrubbing: passwords, emails, phones, tokens, and resumes are never transmitted.
 */
(function(window) {
    'use strict';

    var SENSITIVE_KEYS = [
        'password', 'pass', 'pwd', 'token', 'secret', 'auth', 'key',
        'email', 'mail', 'phone', 'mobile', 'tel', 'aadhaar', 'ssn',
        'resume', 'cv', 'card', 'cvv', 'expiry', 'payment_proof', 'proof_file'
    ];

    var EVENTS = {
        LANDING_PAGE_VIEW: 'landing_page_view',
        ENTRY_POINT_CLICK: 'entry_point_click',
        SIGNUP_COMPLETED: 'signup_completed',
        GOAL_SELECTED: 'goal_selected',
        ASSESSMENT_STARTED: 'assessment_started',
        ASSESSMENT_COMPLETED: 'assessment_completed',
        ROADMAP_GENERATED: 'roadmap_generated',
        TASK_COMPLETED: 'task_completed',
        EVIDENCE_SUBMITTED: 'evidence_submitted',
        SESSION_RESUMED: 'session_resumed',
        CHECKOUT_INITIATED: 'checkout_initiated',
        PAYMENT_CONVERTED: 'payment_converted',
        SUBSCRIPTION_CANCELLED: 'subscription_cancelled',
        INSTITUTIONAL_INQUIRY: 'institutional_inquiry_submitted',
        INSTITUTIONAL_PILOT_CONVERTED: 'institutional_pilot_converted'
    };

    /**
     * Recursively scrubs sensitive PII fields from analytics payloads.
     */
    function scrubPayload(obj, depth) {
        if (!obj || typeof obj !== 'object' || (depth || 0) > 4) {
            return obj;
        }

        if (Array.isArray(obj)) {
            return obj.map(function(item) {
                return scrubPayload(item, (depth || 0) + 1);
            });
        }

        var cleaned = {};
        for (var key in obj) {
            if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
            var lowerKey = key.toLowerCase();
            var isSensitive = SENSITIVE_KEYS.some(function(sensitive) {
                return lowerKey.indexOf(sensitive) !== -1;
            });

            if (isSensitive) {
                cleaned[key] = '[REDACTED_PII]';
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                cleaned[key] = scrubPayload(obj[key], (depth || 0) + 1);
            } else {
                cleaned[key] = obj[key];
            }
        }
        return cleaned;
    }

    var userOptedOut = false;

    /**
     * Checks if user has enabled Do Not Track in their browser or opted out.
     */
    function isDoNotTrackEnabled() {
        if (userOptedOut) return true;
        try {
            if (typeof localStorage !== 'undefined' && localStorage.getItem('dtv_analytics_optout') === 'true') {
                return true;
            }
        } catch (e) {}

        return (typeof window !== 'undefined' && window.navigator) ? (
            window.navigator.doNotTrack === '1' ||
            window.navigator.doNotTrack === 'yes' ||
            window.navigator.msDoNotTrack === '1'
        ) : false;
    }

    /**
     * Retrieves stored auth token safely.
     */
    function getAuthToken() {
        try {
            var raw = localStorage.getItem('dt_user') || sessionStorage.getItem('dt_appdata_v3');
            if (raw) {
                var parsed = JSON.parse(raw);
                return parsed.token || (parsed.userData && parsed.userData.token) || null;
            }
        } catch (e) {
            return null;
        }
        return null;
    }

    var DtvAnalytics = {
        EVENTS: EVENTS,

        setOptOut: function(optOut) {
            userOptedOut = Boolean(optOut);
            try {
                if (typeof localStorage !== 'undefined') {
                    if (optOut) localStorage.setItem('dtv_analytics_optout', 'true');
                    else localStorage.removeItem('dtv_analytics_optout');
                }
            } catch (e) {}
        },

        isOptedOut: function() {
            return isDoNotTrackEnabled();
        },

        /**
         * Core tracking method. Dispatches event to Google Analytics 4 (gtag)
         * with strict PII scrubbing.
         */
        track: function(eventName, params) {
            if (isDoNotTrackEnabled()) {
                return;
            }

            var cleanParams = scrubPayload(params || {});
            cleanParams.timestamp = new Date().toISOString();
            cleanParams.page_location = window.location.pathname;

            // 1. Dispatch to Google Analytics (gtag) if present
            if (typeof window.gtag === 'function') {
                try {
                    window.gtag('event', eventName, cleanParams);
                } catch (gtagErr) {
                    // Suppress telemetry errors silently
                }
            } else if (window.dataLayer && Array.isArray(window.dataLayer)) {
                window.dataLayer.push(Object.assign({ event: eventName }, cleanParams));
            }

            // 2. Dispatch to server-side retention log if authenticated
            if (eventName !== EVENTS.LANDING_PAGE_VIEW && eventName !== EVENTS.ENTRY_POINT_CLICK) {
                DtvAnalytics.trackServer(eventName, cleanParams);
            }
        },

        /**
         * Logs a retention or product milestone event to the backend API.
         */
        trackServer: function(eventName, metadata) {
            var token = getAuthToken();
            if (!token) return;

            var cleanMeta = scrubPayload(metadata || {});
            try {
                fetch('/api/v1/readiness/retention-event', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({
                        eventName: eventName,
                        metadata: cleanMeta
                    })
                }).catch(function() {});
            } catch (e) {}
        },

        /**
         * Helper to track entry point CTA clicks (e.g. Diagnostic start, TPO demo click).
         */
        trackEntryPoint: function(sourceLabel, destinationUrl) {
            DtvAnalytics.track(EVENTS.ENTRY_POINT_CLICK, {
                cta_label: sourceLabel,
                destination: destinationUrl
            });
        },

        /**
         * Helper to track funnel progressions.
         */
        trackFunnelStep: function(stepName, stepNumber, extraData) {
            var payload = Object.assign({
                funnel_step_name: stepName,
                funnel_step_number: stepNumber
            }, extraData || {});
            DtvAnalytics.track('funnel_step_' + stepNumber, payload);
        },

        /**
         * Utility for testing payload sanitization.
         */
        _scrubPayload: scrubPayload
    };

    window.DtvAnalytics = DtvAnalytics;

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = DtvAnalytics;
    }

})(typeof window !== 'undefined' ? window : global);
