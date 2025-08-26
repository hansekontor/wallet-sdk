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
export default function useContacts(): {
    contacts: Contact[];
    addContact: (contact: Contact) => Promise<void>;
    bulkAddContacts: (newContacts: Contact[]) => Promise<void>;
    removeContact: (id: string) => Promise<void>;
    editContact: (updatedContact: Contact) => Promise<void>;
};
