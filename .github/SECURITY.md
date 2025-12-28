# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it by sending an email to security@anthropic.com.

Please include:
- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Any suggested fixes

### What to Expect

- **Acknowledgment**: We will acknowledge receipt of your report within 48 hours.
- **Assessment**: We will assess the vulnerability and determine its severity within 7 days.
- **Fix Timeline**: Critical vulnerabilities will be addressed within 14 days. Other issues will be scheduled based on severity.
- **Disclosure**: We will coordinate with you on the disclosure timeline.

### What We Ask

- **Don't disclose publicly**: Please give us time to address the issue before public disclosure.
- **Don't exploit the vulnerability**: Beyond what's necessary to demonstrate the issue.
- **Provide details**: The more information, the faster we can fix the issue.

## Security Best Practices

When using this MCP server:

1. **Token Security**
   - Never commit tokens to version control
   - Use environment variables for token storage
   - Rotate tokens regularly
   - Use minimum required permissions

2. **GitHub App Security**
   - Keep private keys secure
   - Use short-lived installation tokens
   - Regularly audit app permissions

3. **Deployment Security**
   - Run with least privilege
   - Keep dependencies updated
   - Monitor for unusual activity

## Known Security Considerations

1. **Token Exposure**: Tokens are passed via environment variables. Ensure your environment is secure.

2. **GraphQL Injection**: All user input is validated using Zod schemas before being passed to the GitHub API.

3. **Rate Limiting**: The server does not implement rate limiting. Consider implementing it for high-traffic deployments.

## Dependencies

We regularly update dependencies to address security vulnerabilities. Run `npm audit` to check for known vulnerabilities.

## Security Updates

Security updates are released as patch versions. We recommend:
- Subscribing to release notifications
- Running `npm audit` regularly
- Updating to the latest patch version promptly

Thank you for helping keep this project secure!
