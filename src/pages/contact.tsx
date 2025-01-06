
export default function ContactsPage() {
    const contacts = [
        { name: "Dr. John Doe", role: "Provost", email: "provost@hall.edu", phone: "123-456-7890" },
        { name: "Ms. Jane Smith", role: "Warden", email: "warden@hall.edu", phone: "987-654-3210" },
    ];

    return (
        <div className="contacts-page">
            <h1>Hall Staff Contacts</h1>
            <ul>
                {contacts.map((contact, index) => (
                    <li key={index}>
                        <strong>{contact.name} ({contact.role})</strong><br />
                        Email: {contact.email}<br />
                        Phone: {contact.phone}
                    </li>
                ))}
            </ul>
        </div>
    );
}
