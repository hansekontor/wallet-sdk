import { useState, useEffect, useCallback } from "react";
import localforage from "localforage";
import { v4 as uuidv4 } from "uuid";

export type Contact = {
  id: string;
  name: string;
  address: string;
};

/**
 * Hook for managing contacts in local storage.
 *
 * Provides functions to add, remove, edit, and bulk add contacts,
 * automatically persisting changes to localForage.
 *
 * @returns An object with the current contact list and management functions.
 */
export default function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);

  // Load from localForage on mount
  useEffect(() => {
    (async () => {
      const stored = await localforage.getItem<Contact[]>("contacts");
      setContacts(stored ?? []);
    })();
  }, []);

  /**
   * Adds a single contact to the list.
   * Generates a unique ID for the contact.
   *
   * @param contact - The contact object to add.
   */
  const addContact = useCallback(
    async (contact: Contact) => {
      const updated = [...contacts, { ...contact, id: uuidv4() }];
      setContacts(updated);
      await localforage.setItem("contacts", updated);
    },
    [contacts]
  );

  /**
   * Adds multiple contacts to the list in bulk.
   * Generates unique IDs for each contact.
   *
   * @param newContacts - Array of contacts to add.
   */
  const bulkAddContacts = useCallback(
    async (newContacts: Contact[]) => {
      const contactsWithIds = newContacts.map((c) => ({
        ...c,
        id: uuidv4(),
      }));
      const updated = [...contacts, ...contactsWithIds];
      setContacts(updated);
      await localforage.setItem("contacts", updated);
    },
    [contacts]
  );

  /**
   * Removes a contact by its ID.
   *
   * @param id - The ID of the contact to remove.
   */
  const removeContact = useCallback(
    async (id: string) => {
      const updated = contacts.filter((c) => c.id !== id);
      setContacts(updated);
      await localforage.setItem("contacts", updated);
    },
    [contacts]
  );

  /**
   * Edits an existing contact.
   * Matches contact by ID and updates its information.
   *
   * @param updatedContact - The contact object with updated data.
   */
  const editContact = useCallback(
    async (updatedContact: Contact) => {
      const updated = contacts.map((c) =>
        c.id === updatedContact.id ? updatedContact : c
      );
      setContacts(updated);
      await localforage.setItem("contacts", updated);
    },
    [contacts]
  );

  return {
    contacts,
    addContact,
    bulkAddContacts,
    removeContact,
    editContact,
  };
}
