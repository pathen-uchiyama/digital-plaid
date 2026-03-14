/**
 * Castle Companion - Skipper Factory OTP Sniffer
 * 
 * This Cloudflare Email Routing Worker intercepts authentication emails 
 * sent by Disney to our 6-domain utility fleet.
 * It extracts the 6-digit One-Time Passcode (OTP) and immediately 
 * pushes it to our Upstash Redis cluster so the Playwright Skipper bots 
 * can login without manual human intervention.
 */

export interface Env {
    // Bindings defined in wrangler.toml or the Cloudflare Dashboard
    UPSTASH_REDIS_REST_URL: string;
    UPSTASH_REDIS_REST_TOKEN: string;
}

export default {
    async email(message: ForwardableEmailMessage, env: Env, ctx: ExecutionContext): Promise<void> {
        try {
            // 1. Read the raw email body
            const rawEmail = await new Response(message.raw).text();

            // 2. Extract the destination email (e.g., bot123@cc-ops-gateway.net)
            const targetEmail = message.to.toLowerCase().trim();

            console.log(`Intercepted email for: ${targetEmail}`);

            // 3. Extract the 6-digit OTP using regex
            // Disney OTPs are typically 6 numbers. We look for a 6-digit boundary.
            const otpRegex = /\b\d{6}\b/;
            const match = rawEmail.match(otpRegex);

            if (!match) {
                console.log("No 6-digit OTP found in this email payload. Discarding.");
                // We do not forward or keep junk email
                return;
            }

            const otpCode = match[0];
            console.log(`Extracted OTP ${otpCode} for ${targetEmail}`);

            // 4. Push directly to Upstash Redis via REST API
            if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
                // We set the key as 'otp:{email}' with an Expiration (EX) of 120 seconds.
                // OTPs map to the specific bot trying to login.
                const redisEndpoint = `${env.UPSTASH_REDIS_REST_URL}/set/otp:${encodeURIComponent(targetEmail)}/${otpCode}?EX=120`;

                const response = await fetch(redisEndpoint, {
                    headers: {
                        "Authorization": `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`
                    }
                });

                if (response.ok) {
                    console.log(`Successfully stored OTP in Redis for ${targetEmail}`);
                } else {
                    console.error(`Upstash Redis failed with status: ${response.status}`);
                    console.error(await response.text());
                }
            } else {
                console.error("Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN in environment bindings.");
            }

        } catch (error) {
            console.error("Error processing incoming email:", error);
        }
    }
};
