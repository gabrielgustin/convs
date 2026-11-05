import { ContactList } from "@/components/contacts/contact-list"
import type { Params } from "@/lib/list-params"

export default async function ClientsPage({ searchParams }: { searchParams: Promise<Params> }) {
  return <ContactList entity="client" params={await searchParams} />
}
