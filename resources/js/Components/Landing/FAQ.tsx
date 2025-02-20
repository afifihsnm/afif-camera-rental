import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/Components/ui/accordion";

const faqs = [
  {
    question: "What are your rental periods?",
    answer:
      "We offer flexible rental periods including daily, weekly, and monthly options to suit your project needs."
  },
  {
    question: "What happens if I damage the equipment?",
    answer:
      "We offer equipment protection plans. If damage occurs, report it immediately, and we'll guide you through the process."
  },
  {
    question: "What are your pickup/return options?",
    answer:
      "We offer both in-store pickup and delivery options. Returns can be made in-store or via scheduled pickup."
  },
  {
    question: "Do you offer insurance?",
    answer:
      "Yes, we offer optional insurance coverage for all our rental equipment. Ask our team for details."
  },
  {
    question: "What types of cameras do you rent?",
    answer:
      "We rent a wide range of cameras including DSLRs, mirrorless, cinema cameras, and more from top brands."
  },
  {
    question: "What are your payment methods?",
    answer:
      "We accept all major credit cards, debit cards, and PayPal for online bookings. Cash is accepted for in-store transactions."
  }
];

export default function FAQ() {
  return (
    <section id="faq" className="container py-12 lg:py-16">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
        Frequently Asked Questions
      </h2>
      <Accordion type="single" collapsible className="mt-8">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
