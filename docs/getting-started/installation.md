import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Installation

Choose your preferred way to get started with Revisium:

<Tabs defaultValue="cloud">
<TabItem value="cloud" label="Cloud (Sandbox)" default>

The fastest way to get started is with our hosted service:

**Sign up** at [https://cloud.revisium.io/](https://cloud.revisium.io/signup) using Google or GitHub and start building immediately - no setup required!

Perfect for testing, prototyping, and small projects.

</TabItem>
<TabItem value="docker-compose" label="Self-hosted (Docker)">

Perfect for local development and self-hosting:

**Step 1:** Create a `docker-compose.yml` file with the following content:

```yaml
services:
  db:
    image: postgres:17.4-alpine
    restart: always
    environment:
      POSTGRES_DB: revisium-dev
      POSTGRES_USER: revisium
      POSTGRES_PASSWORD: <password>
  revisium:
    pull_policy: always
    depends_on:
      - db
    image: revisium/revisium:v2.0.0
    ports:
      - 8080:8080
    environment:
      DATABASE_URL: postgresql://revisium:<password>@db:5432/revisium-dev?schema=public
```

**Step 2:** Replace `<password>` with a secure password of your choice

**Step 3:** Run the services:

```shell
docker-compose up -d
```

**Step 4:** Access your instance at [http://localhost:8080](http://localhost:8080)

**Step 5:** Login using the default credentials:

- Username: `admin`
- Password: `admin`

🎉 **You're ready to go!** Your Revisium instance is now running locally.

</TabItem>
</Tabs>

## Next Steps

Once you have Revisium installed, proceed to [First Steps](./first-steps) to create your first project and start building with Revisium.
