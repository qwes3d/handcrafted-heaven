import { createContact, getContacts } from "@/controllers/contactController";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.json();
    const result = await createContact(data);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const result = await getContacts();
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
