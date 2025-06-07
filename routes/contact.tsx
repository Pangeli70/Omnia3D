import { Handlers, PageProps } from "$fresh/server.ts";
import { z } from "zod";
import { FieldErrorMessage } from "../components/FieldErrorMessage.tsx";

enum Language {
  EN = "en",
  //   ES = "es",
  //   FR = "fr",
  //   DE = "de",
  //   IT = "it",
}

enum FieldNames {
  LANG = "lang",
  NAME = "name",
  EMAIL = "email",
  MESSAGE = "message",
}

enum FieldLimits {
  NAME_MIN = 2,
  NAME_MAX = 50,
  MESSAGE_MIN = 10,
  MESSAGE_MAX = 500,
}

type Translation = {
  lang: Language;
  form: {
    title: string;
    name: string;
    email: string;
    message: string;
    submit: string;
    successMessage: string;
  };
  errors: {
    z_name_min: string;
    z_name_max: string;
    z_email_invalid: string;
    z_message_min: string;
    z_message_max: string;
  };
};

type Translations = Record<Language, Translation>;

// Define the translations for the contact page.
const translations: Translations = {
  [Language.EN]: {
    lang: Language.EN,
    form: {
      title: "Contact Us",
      name: "Name",
      email: "Email",
      message: "Message",
      submit: "Send Message",
      successMessage:
        "Your message has been sent. Thank you for contacting us.",
    },
    errors: {
      z_name_min: "Name must be at least 2 characters long.",
      z_name_max: "Name must be at most 50 characters long.",
      z_email_invalid: "Please enter a valid email address.",
      z_message_min: "Message must be at least 10 characters long.",
      z_message_max: "Message must be at most 500 characters long.",
    },
  },
};

// This schema will be used to validate the input on the server.
const contactSchema = z.object({
  name: z.string()
    .min(FieldLimits.NAME_MIN, "Name must be at least 2 characters long.")
    .max(FieldLimits.NAME_MAX, "Name must be at most 50 characters long."),

  email: z.string()
    .email("Please enter a valid email address."),

  message: z.string()
    .min(
      FieldLimits.MESSAGE_MIN,
      "Message must be at least 10 characters long.",
    )
    .max(
      FieldLimits.MESSAGE_MAX,
      "Message must be at most 500 characters long.",
    ),
});

// Define the type for the data passed to the page component.
// This will include potential errors, a success message, and submitted values.
type PageData = {
  success: boolean;
  errors?: z.ZodError["formErrors"]["fieldErrors"];
  submittedData?: {
    name: string;
    email: string;
    message: string;
  };
  translation?: Translation;
};

// 2. Create the Fresh Handlers to process GET and POST requests.
export const handler: Handlers<PageData> = {
  // The GET handler simply renders the page.
  GET(req, ctx) {
    let translation = translations[Language.EN];
    const acceptLanguageHeader = req.headers.get("Accept-Language");
    if (acceptLanguageHeader) {
      console.log("Accept-Language header:", acceptLanguageHeader);
        const lang = acceptLanguageHeader.split(",")[0].trim() as Language;
        if(lang in translations) {
            translation = translations[lang]
        }
    }

    return ctx.render({ success: false, translation });
  },

  // The POST handler processes the form submission.
  async POST(req, ctx) {
    // Get the form data from the request.
    const formData = await req.formData();

    const lang = formData.get(FieldNames.LANG) as Language;
    const translation = translations[lang || Language.EN];

    const name = formData.get(FieldNames.NAME) as string;
    const email = formData.get(FieldNames.EMAIL) as string;
    const message = formData.get(FieldNames.MESSAGE) as string;
    const submittedData = { name, email, message };

    // Use Zod's `safeParse`. It doesn't throw an error on failure,
    // which is perfect for handling form validation gracefully.
    const validationResult = contactSchema.safeParse(submittedData);

    // If validation fails...
    if (!validationResult.success) {
      console.error(
        "Validation failed:",
        validationResult.error.flatten().fieldErrors,
      );
      // Re-render the page, passing the errors and the data the user submitted.
      // This allows you to show error messages and keep the form populated.
      return ctx.render({
        success: false,
        translation,
        errors: validationResult.error.flatten().fieldErrors,
        submittedData: submittedData,
      });
    }

    // If validation succeeds...
    // In a real app, you would now send an email, save to a database, etc.
    console.log("Validation successful! Data:", validationResult.data);

    // Render the page with a success message.
    return ctx.render({ success: true, translation });
  },
};

// 3. Create the Page Component with Preact/JSX.
export default function ContactPage({ data }: PageProps<PageData>) {
  const t = data.translation!;
  const e = data.errors || {};

  return (
    <div>
      <h1>{t.form.title}</h1>

      {!data.success && (
        <form method="POST" noValidate>
          <input
            type="hidden"
            name={FieldNames.LANG}
            value={t.lang}
          />
          <div>
            <label for={FieldNames.NAME}>
              {t.form.name}
            </label>
            <input
              type="text"
              id={FieldNames.NAME}
              name={FieldNames.NAME}
              minLength={FieldLimits.NAME_MIN}
              maxLength={FieldLimits.NAME_MAX}
              // Repopulate with submitted value on error
              defaultValue={data?.submittedData?.name}
            />
            {/* Display validation error for the name field */}
            {e?.name && <FieldErrorMessage message={e.name[0]} />}
          </div>

          <div>
            <label for={FieldNames.EMAIL}>
              {t.form.email}
            </label>
            <input
              type="email"
              id={FieldNames.EMAIL}
              name={FieldNames.EMAIL}
              defaultValue={data?.submittedData?.email}
            />
            {e?.email && <FieldErrorMessage message={e.email[0]} />}
          </div>

          <div>
            <label for={FieldNames.MESSAGE}>
              {t.form.message}
            </label>
            <textarea
              id={FieldNames.MESSAGE}
              name={FieldNames.MESSAGE}
              rows={4}
              minLength={FieldLimits.MESSAGE_MIN}
              maxLength={FieldLimits.MESSAGE_MAX}
              defaultValue={data?.submittedData?.message}
            >
            </textarea>
            {e?.message && <FieldErrorMessage message={e.message[0]} />}
          </div>

          <div>
            <button type="submit">
              {t.form.submit}
            </button>
          </div>
        </form>
      )}

      {data.success && (
        <div role="alert">
          <p>{t.form.successMessage}</p>
        </div>
      )}
    </div>
  );
}
