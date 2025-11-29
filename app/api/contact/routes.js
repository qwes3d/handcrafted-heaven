import { createContact, getContacts } from "@/controllers/contactController";

export async function POST(request) {
  try {
    const data = await request.json();
    const result = await createContact(data);
    return Response.json(result, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const result = await getContacts();
    return Response.json(result);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
