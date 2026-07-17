"use client";

// Registers every demo user as a Velt contact so the composer's @mention
// autocomplete lists all of them regardless of who has signed in. Pattern from
// the altana-wireframes reference (ContactsRegistrar).
import { useEffect } from "react";
import { useContactUtils } from "@veltdev/react";
import type { UserContact } from "@veltdev/types";
import { users } from "./users";

export function ContactsRegistrar() {
  const contactElement = useContactUtils();

  useEffect(() => {
    if (!contactElement) return;
    const contacts = Object.values(users).map((u) => ({
      userId: u.userId,
      name: u.name,
      email: u.email,
      photoUrl: u.photoUrl,
      visibility: "group",
    })) as UserContact[];
    contactElement.updateContactList(contacts, { merge: false });
    contactElement.updateOrgList({
      orgList: [
        { id: "owner-org-1", name: "Owner Org 1" },
        { id: "customer-org-1", name: "Customer Org 1" },
      ],
    });
  }, [contactElement]);

  return null;
}

export default ContactsRegistrar;
