# Project Instructions

## Architecture & Identity
- **User Identity:** The application does not store user information (name, email, etc.) in the local database. It relies exclusively on the Clerk `user_id` provided by the authentication provider for all operations and relationships.
