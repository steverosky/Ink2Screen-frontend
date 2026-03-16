import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Legal — Terms & Conditions",
  description:
    "Ink2Screen LLC Publishing website legal framework, terms of service, privacy policy, and marketplace policy.",
}

function SectionHeading({ id, number, title }: { id: string; number: string; title: string }) {
  return (
    <h2
      id={id}
      className="mb-4 mt-12 scroll-mt-24 font-heading text-2xl font-bold tracking-tight text-brand-gold md:text-3xl"
    >
      {number}. {title}
    </h2>
  )
}

function SubHeading({ id, number, title }: { id: string; number: string; title: string }) {
  return (
    <h3
      id={id}
      className="mb-2 mt-8 scroll-mt-24 text-lg font-semibold text-[#f0f0f0]"
    >
      {number} {title}
    </h3>
  )
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 leading-[1.8] text-[#c0c0c0]">{children}</p>
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mb-4 list-disc space-y-1 pl-6 text-[#c0c0c0]">
      {items.map((item) => (
        <li key={item} className="leading-[1.7]">
          {item}
        </li>
      ))}
    </ul>
  )
}

const tocItems = [
  { id: "terms", label: "Master Terms & Conditions" },
  { id: "privacy", label: "Privacy Policy" },
  { id: "marketplace", label: "Marketplace Policy" },
  { id: "events", label: "Event Terms & Liability Waiver" },
  { id: "ip", label: "Intellectual Property & Submission Policy" },
  { id: "accessibility", label: "Accessibility Statement" },
]

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      {/* Header */}
      <div className="mb-12 text-center">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">
          Ink2Screen
        </p>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-[#f0f0f0] md:text-5xl">
          Website Legal Framework
        </h1>
        <p className="mt-4 text-sm text-[#888]">
          Governing Law: State of Texas
        </p>
      </div>

      {/* Table of Contents */}
      <nav className="mb-12 rounded-lg border border-[#222] bg-[#0a0a0a] p-6">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-brand-gold">
          Contents
        </p>
        <ol className="space-y-2">
          {tocItems.map((item, i) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="text-sm text-[#c0c0c0] transition-colors hover:text-brand-gold"
              >
                {i + 1}. {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* ── 1. MASTER TERMS & CONDITIONS ── */}
      <SectionHeading id="terms" number="1" title="Master Terms & Conditions" />

      <SubHeading id="terms-intro" number="1.1" title="Introduction" />
      <Paragraph>
        This website is owned and operated by Ink2Screen (&quot;Company,&quot;
        &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). These Terms govern
        all use of the website, marketplace, and event services.
      </Paragraph>

      <SubHeading id="terms-acceptance" number="1.2" title="Acceptance of Terms" />
      <Paragraph>
        By accessing or using this website, users agree to be legally bound by
        these Terms and Conditions.
      </Paragraph>

      <SubHeading id="terms-ip" number="1.3" title="Intellectual Property Ownership" />
      <Paragraph>
        All content is the exclusive property of Ink2Screen and protected under
        U.S. intellectual property law, including but not limited to:
      </Paragraph>
      <BulletList
        items={[
          "Books",
          "Manuscripts",
          "Scripts",
          "Podcast episodes",
          "Visual media",
          "Logos and branding elements",
        ]}
      />

      <SubHeading id="terms-conduct" number="1.4" title="User Conduct" />
      <Paragraph>Users agree not to:</Paragraph>
      <BulletList
        items={[
          "Violate any laws",
          "Copy or distribute protected content",
          "Attempt unauthorized access",
          "Reverse engineer digital products",
          "Use content commercially without written consent",
        ]}
      />

      <SubHeading id="terms-liability" number="1.5" title="Limitation of Liability" />
      <Paragraph>
        Ink2Screen shall not be liable for website interruptions, technical
        failures, loss of data, or third-party disputes.
      </Paragraph>

      <SubHeading id="terms-indemnification" number="1.6" title="Indemnification" />
      <Paragraph>
        Users agree to indemnify and hold harmless Ink2Screen from claims arising
        from misuse of the website.
      </Paragraph>

      <SubHeading id="terms-disputes" number="1.7" title="Dispute Resolution" />
      <Paragraph>
        All disputes shall be resolved through binding arbitration in the State
        of Texas. Users waive class action participation.
      </Paragraph>

      {/* ── 2. PRIVACY POLICY ── */}
      <SectionHeading id="privacy" number="2" title="Privacy Policy" />

      <SubHeading id="privacy-collected" number="2.1" title="Information Collected" />
      <BulletList
        items={[
          "Name",
          "Email address",
          "Billing information",
          "Event registration details",
          "Website analytics data",
        ]}
      />

      <SubHeading id="privacy-use" number="2.2" title="Use of Information" />
      <Paragraph>
        Information is collected to process transactions, distribute newsletters,
        coordinate events, and improve performance.
      </Paragraph>

      <SubHeading id="privacy-security" number="2.3" title="Data Security" />
      <Paragraph>
        Payments are processed through secure third-party providers. Reasonable
        safeguards are implemented to protect data.
      </Paragraph>

      <SubHeading id="privacy-rights" number="2.4" title="User Rights" />
      <BulletList
        items={[
          "Unsubscribe from communications",
          "Request data deletion",
          "Opt out of marketing",
        ]}
      />

      <SubHeading id="privacy-cookies" number="2.5" title="Cookies & Tracking" />
      <Paragraph>
        The website may use cookies and analytics tools to enhance user
        experience.
      </Paragraph>

      {/* ── 3. MARKETPLACE POLICY ── */}
      <SectionHeading id="marketplace" number="3" title="Marketplace Policy" />

      <SubHeading id="marketplace-descriptions" number="3.1" title="Product Descriptions" />
      <Paragraph>
        Product descriptions are provided as accurately as possible but may
        contain minor variations.
      </Paragraph>

      <SubHeading id="marketplace-pricing" number="3.2" title="Pricing & Payments" />
      <Paragraph>
        All prices are listed in USD. Applicable taxes may apply.
      </Paragraph>

      <SubHeading id="marketplace-refunds" number="3.3" title="Refund Policy" />
      <BulletList
        items={[
          "Physical goods: Refunds within designated timeframe if unused",
          "Digital products: Generally non-refundable",
          "Event tickets: Subject to event-specific terms",
        ]}
      />

      <SubHeading id="marketplace-shipping" number="3.4" title="Shipping" />
      <Paragraph>
        Shipping timelines are estimates and may vary.
      </Paragraph>

      <SubHeading id="marketplace-fraud" number="3.5" title="Fraud & Chargebacks" />
      <Paragraph>
        Ink2Screen reserves the right to refuse service or cancel orders
        suspected of fraud.
      </Paragraph>

      {/* ── 4. EVENT TERMS & LIABILITY WAIVER ── */}
      <SectionHeading id="events" number="4" title="Event Terms & Liability Waiver" />

      <SubHeading id="events-risk" number="4.1" title="Assumption of Risk" />
      <Paragraph>
        Participants assume all risks associated with attending events.
      </Paragraph>

      <SubHeading id="events-release" number="4.2" title="Release of Liability" />
      <Paragraph>
        Attendees release Ink2Screen from liability for injury, loss, or damage.
      </Paragraph>

      <SubHeading id="events-media" number="4.3" title="Media Release" />
      <Paragraph>
        Attendees grant permission for photographs or recordings to be used for
        promotional purposes.
      </Paragraph>

      <SubHeading id="events-conduct" number="4.4" title="Code of Conduct" />
      <Paragraph>
        Disruptive or unlawful behavior will result in removal without refund.
      </Paragraph>

      <SubHeading id="events-cancellation" number="4.5" title="Cancellation Policy" />
      <Paragraph>
        Ink2Screen reserves the right to reschedule or cancel events due to
        unforeseen circumstances.
      </Paragraph>

      {/* ── 5. INTELLECTUAL PROPERTY & SUBMISSION POLICY ── */}
      <SectionHeading id="ip" number="5" title="Intellectual Property & Submission Policy" />

      <SubHeading id="ip-unsolicited" number="5.1" title="No Unsolicited Submissions" />
      <Paragraph>
        Ink2Screen does not accept unsolicited scripts, manuscripts, or creative
        proposals. Materials submitted voluntarily are not confidential unless
        agreed in writing.
      </Paragraph>

      <SubHeading id="ip-copyright" number="5.2" title="Copyright Notice" />
      <Paragraph>
        All works are protected under U.S. Copyright Law.
      </Paragraph>

      <SubHeading id="ip-dmca" number="5.3" title="DMCA Notice" />
      <Paragraph>
        Copyright infringement claims must be submitted in writing to a
        designated company email address.
      </Paragraph>

      {/* ── 6. ACCESSIBILITY STATEMENT ── */}
      <SectionHeading id="accessibility" number="6" title="Accessibility Statement" />
      <Paragraph>
        Ink2Screen is committed to providing an inclusive and accessible digital
        experience. Users requiring assistance may contact the designated support
        email.
      </Paragraph>

      {/* Footer line */}
      <div className="mt-16 border-t border-[#222] pt-6 text-center text-xs text-[#888]">
        <p>&copy; {new Date().getFullYear()} Ink2Screen LLC Publishing. All rights reserved.</p>
      </div>
    </div>
  )
}
