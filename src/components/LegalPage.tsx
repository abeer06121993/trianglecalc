interface LegalPageProps {
  type: 'privacy' | 'imprint' | 'contact';
}

const content = {
  privacy: {
    title: 'Privacy Policy',
    body: (
      <>
        <p>This page is a publication template and must be completed with the operator, hosting, analytics, advertising and contact details before the website is used commercially.</p>
        <h2>Website operation</h2>
        <p>TriangleCalc is an online triangle calculator. The calculator itself processes the values entered by the visitor in the browser and does not need to send those calculation values to a server.</p>
        <h2>Hosting and technical data</h2>
        <p>When the website is hosted, the hosting provider may process technical information such as IP address, date and time of access, requested files and browser information. Replace this section with the exact provider and retention information used for the live website.</p>
        <h2>Advertising</h2>
        <p>If advertising is enabled, this section must identify the advertising provider, the purposes of processing, cookies or local storage, recipients and the available consent and withdrawal options. For Google advertising in the EEA, UK and Switzerland, use the required Google-certified consent setup before serving personalized advertising.</p>
        <h2>Contact</h2>
        <p>Add the responsible operator's postal address and email address here.</p>
        <h2>Last updated</h2>
        <p>Replace this date with the date on which the final privacy policy was reviewed.</p>
      </>
    ),
  },
  imprint: {
    title: 'Imprint',
    body: (
      <>
        <p>This page is a template and must be completed with the actual operator information before publication.</p>
        <h2>Operator</h2>
        <p>[Full legal name]<br />[Street and house number]<br />[Postcode and city]<br />[Country]</p>
        <h2>Contact</h2>
        <p>Email: [your email address]<br />Telephone: [optional]</p>
        <h2>Responsible for content</h2>
        <p>[Name and address of the person legally responsible for the content]</p>
      </>
    ),
  },
  contact: {
    title: 'Contact',
    body: (
      <>
        <p>For questions, corrections or feedback about TriangleCalc, contact:</p>
        <p><strong>Email:</strong> [your email address]</p>
        <p>Replace the placeholder above before publishing the final website.</p>
      </>
    ),
  },
} as const;

export function LegalPage({ type }: LegalPageProps) {
  const page = content[type];

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <a href="/" className="text-sm text-blue-600 hover:text-blue-800">← Back to TriangleCalc</a>
      <article className="mt-8 prose prose-slate max-w-none">
        <h1>{page.title}</h1>
        {page.body}
      </article>
    </main>
  );
}
