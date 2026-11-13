# Package enquiry — backend checklist

**Status:** Proposal, pending backend review. The modal is built and uses a mock submit (see "Frontend workaround" below); nothing is stored or sent.

**Audience:** Backend team, before adding an enquiry endpoint.

**Scope:** the **Send Enquiry** button on the package page.

**Related:** [`package-guide-profile-checklist.md`](./package-guide-profile-checklist.md) — the guide an enquiry could be routed to.

---

## 1. What the UI does

**Send Enquiry** opens a modal titled "Plan your trek with us", with the line "Share your preferred date and we'll suggest the best options." It collects:

| Field | Required |
|---|---|
| First name | yes |
| Email address | yes |
| Phone number | yes |
| "Any questions, group size, or special requirements?" (free text) | no |

On submit the modal switches to a confirmation: "Enquiry submitted successfully, {first name}!", a note that the team may contact the user on WhatsApp or phone, "A confirmation has been sent to {email}", and a "Chat with Scoutripper on WhatsApp" button.

The page also knows which package the enquiry is about (`packageId`).

## 2. Current situation

There is **no enquiry endpoint and no enquiry model** anywhere in `apps/api` or the Prisma schema. The submit in the modal is a mock that waits briefly and reports success. Nothing is stored, nobody is notified, and no email is sent.

That matters because the confirmation text makes promises the system cannot keep today: that a confirmation was sent to the user's email, and that the team will reach out.

## 3. Proposed endpoint

```
POST /api/package/{packageId}/enquiries
```

Body: `{ firstName, email, phone, message? }`. Returns `201` with the created enquiry's id.

- **Public** (no login), since the form is open to visitors. If the user is logged in, the request may also carry their user id so the enquiry can be linked to their account.
- Validate the package exists and is published and public, and return `404` otherwise.
- Validate email format, a phone number pattern, and field lengths (a cap on `message`).

## 4. Proposed data and behaviour

```prisma
model PackageEnquiry {
  id        String   @id @map("_id")
  packageId String
  userId    String?          // set when the visitor is logged in

  firstName String
  email     String
  phone     String
  message   String?

  status    EnquiryStatus @default(NEW)   // NEW | CONTACTED | CLOSED
  createdAt DateTime @default(now())
}
```

On create the backend should:
1. **Store** the enquiry.
2. **Send the confirmation email** to the address given, because the UI says it was sent.
3. **Notify whoever handles it** (see question 1): the package's guide, the platform team, or both.

## 5. Abuse and privacy

- **Public form, so rate-limit** by IP and by email, and consider a honeypot field or a captcha. Otherwise it is an open channel for spam into vendors' inboxes.
- **Personal data.** Name, email and phone are stored. Decide how long they are kept and who can read them. Exposing them only to the package's own vendor and to admins is the safe default.

## 6. Open questions for backend and product

1. **Who receives the enquiry?** The vendor who runs the package, the Scoutripper team, or both? The success text says "our team will reach out", which implies the platform team.
2. **Preferred date.** The subtitle asks the user to "share your preferred date", but the design has no date field. Add a date field, or change the subtitle? If a date is wanted, should it be one of the package's schedules, or free text?
3. **Group size.** It is currently only a hint inside the free-text box. Should it be a field, so enquiries can be filtered or prioritised?
4. **Confirmation email.** Is there an email sender in the backend today? The confirmation promise depends on it.
5. **Logged-in users.** Prefill name, email and phone from the account, and link the enquiry to it?
6. **WhatsApp number.** The "Chat with Scoutripper on WhatsApp" link needs the support number. The frontend reads it from `NEXT_PUBLIC_WHATSAPP_NUMBER`; confirm the number and whether it should come from the backend instead.
7. **Lifecycle.** Does an enquiry need a status (new, contacted, closed) and an admin or vendor view to work through them?

## 7. Frontend workaround

- `apps/web/lib/package-enquiry-mock.ts` exposes `submitPackageEnquiry`, which only waits and resolves. Once the endpoint exists, replace its body with a real call, in a new module under `api/` following the existing layout. The modal depends only on that function, and shows an error message if it rejects.
- The WhatsApp link uses `NEXT_PUBLIC_WHATSAPP_NUMBER` (documented in `.env.local.example`). When it is unset the button opens WhatsApp without a chat.
- The phone check in the modal is a basic pattern. Align it with the backend's rule once there is one.
