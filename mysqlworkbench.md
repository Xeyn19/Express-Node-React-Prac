# Import SQL File to Aiven Using MySQL Workbench

This is the easiest way to import your local `.sql` file into Aiven MySQL.

## 1. What You Need

Before starting, make sure you have:

- your exported `.sql` file
- an active Aiven MySQL service
- MySQL Workbench installed on your computer

## 2. Get Aiven Database Connection Details

Open Aiven and go to your MySQL service.

Copy these values from the service overview:

- `host`
- `port`
- `username`
- `password`
- `database name`

If Aiven shows an SSL or CA certificate download option, download it too.

## 3. Open MySQL Workbench

1. Open **MySQL Workbench**
2. Click the `+` button next to **MySQL Connections**
3. Create a new connection

## 4. Fill in the Connection

Enter the Aiven values:

- **Connection Name**: any name you want
- **Hostname**: your Aiven host
- **Port**: your Aiven port
- **Username**: your Aiven username

Then:

1. Click **Store in Vault** or **Store Password**
2. Enter your Aiven password

If Aiven requires SSL:

1. Open the **SSL** tab
2. Set the **SSL CA File** to the CA certificate you downloaded from Aiven

Then click **Test Connection**.

If the connection succeeds, click **OK**.

## 5. Open the Aiven Connection

1. In MySQL Workbench, click the new connection
2. Wait for it to connect

You should now be inside your Aiven database connection.

## 6. Import the SQL File

1. In the top menu, click **Server**
2. Click **Data Import**
3. Choose **Import from Self-Contained File**
4. Browse and select your `.sql` file
5. Under **Default Target Schema**, choose your Aiven database
6. Click **Start Import**

Wait for the import to finish.

## 7. Check if the Import Worked

After import:

1. Refresh the schema list on the left
2. Open your database
3. Open **Tables**

You should see tables from your project, such as:

- `users`
- `job_applications`
- `user_profile`

## 8. Run a Quick Check

Open a query tab and run:

```sql
SHOW TABLES;
```

If you want to confirm imported users:

```sql
SELECT * FROM users LIMIT 5;
```

## 9. What You Should Expect

Your `.sql` file will not appear as a file inside Aiven.

Instead, after import, its contents become:

- databases
- tables
- rows

That means you will see tables and data, not the `.sql` file itself.

## 10. After Import

Once the tables exist in Aiven:

1. make sure Render backend env vars point to the same Aiven database
2. redeploy Render if needed
3. test login again from your frontend

## 11. Common Problems

- wrong host, port, username, or password
- wrong target schema selected during import
- SSL certificate not configured when required
- importing into an empty or different database than the one Render uses
- `.sql` file missing the required project tables

## 12. Project Tables to Expect

This backend expects at least these tables:

- `users`
- `job_applications`
- `user_profile`
