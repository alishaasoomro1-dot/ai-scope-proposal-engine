import bcrypt from "bcryptjs";
import { db } from "./index";
import { users, profiles, jobs, proposals } from "./schema";

async function main() {
  const password = await bcrypt.hash("Password123!", 10);
  await db.delete(users);
  const [, freelancer, client] = await db.insert(users).values([
    { name: "Admin", email: "admin@example.com", password, role: "admin" },
    { name: "Fatima Khan", email: "freelancer@example.com", password, role: "freelancer" },
    { name: "Ali Traders", email: "client@example.com", password, role: "client" },
  ]).returning();
  await db.insert(profiles).values({
    userId: freelancer.id, fullName: "Fatima Khan", skills: "WordPress, Excel, Prompt Engineering, Content Creation",
    experience: "intermediate", portfolio: "https://example.com/portfolio", hourlyRate: 15,
    bio: "Freelancer building websites and spreadsheet dashboards for small businesses.",
    projects: "Portfolio website for a bakery; sales dashboard in Google Sheets",
  });
  const [job] = await db.insert(jobs).values([
    { clientId: client.id, title: "WordPress site for a clothing store", description: "Need a 5-page WordPress site with WooCommerce, mobile friendly, delivered in 3 weeks.", budget: 400 },
    { clientId: client.id, title: "Excel sales dashboard", description: "Monthly sales dashboard with pivot tables and charts from our CSV exports.", budget: 150 },
  ]).returning();
  await db.insert(proposals).values({ userId: freelancer.id, jobId: job.id, jobTitle: job.title, content: "Hello! I would love to build your WordPress store. (Sample proposal from seed data.)" });
  console.log("Seeded. Logins: admin@/freelancer@/client@example.com, password Password123!");
  process.exit(0);
}
main().catch((e) => { console.error(e); process.exit(1); });
