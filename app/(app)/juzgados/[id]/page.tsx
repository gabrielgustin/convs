import { ContactDetail } from "@/components/contacts/contact-detail"

export default async function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <ContactDetail entity="court" id={(await params).id} />
}
