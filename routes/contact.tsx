import { Handlers, PageProps } from '$fresh/server.ts';
import { z } from 'zod';
import { FieldErrorMessage } from '../components/FieldErrorMessage.tsx';
import { LinkButton } from "../islands/LinkButton.tsx";

enum Language {
    EN = 'en',
    //   ES = "es",
    //   FR = "fr",
    //   DE = "de",
    IT = 'it',
}

enum FieldNames {
    LANG = 'lang',
    NAME = 'name',
    EMAIL = 'email',
    MESSAGE = 'message',
}

enum FieldLimits {
    NAME_MIN = 2,
    NAME_MAX = 50,
    MESSAGE_MIN = 10,
    MESSAGE_MAX = 500,
}

enum ZodErrors {
    Z_NAME_MIN = 'z_name_min',
    Z_NAME_MAX = 'z_name_max',
    Z_EMAIL_INVALID = 'z_email_invalid',
    Z_MESSAGE_MIN = 'z_message_min',
    Z_MESSAGE_MAX = 'z_message_max',
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
        [ZodErrors.Z_NAME_MIN]: string;
        [ZodErrors.Z_NAME_MAX]: string;
        [ZodErrors.Z_EMAIL_INVALID]: string;
        [ZodErrors.Z_MESSAGE_MIN]: string;
        [ZodErrors.Z_MESSAGE_MAX]: string;
    };
};

type Translations = Record<Language, Translation>;

// Define the translations for the contact page.
const translations: Translations = {
    [Language.EN]: {
        lang: Language.EN,
        form: {
            title: 'Contact Us',
            name: 'Name',
            email: 'Email',
            message: 'Message',
            submit: 'Send Message',
            successMessage:
                'Your message has been sent. Thank you for contacting us.',
        },
        errors: {
            [ZodErrors.Z_NAME_MIN]:
                'Name must be at least [%1] characters long.',
            [ZodErrors.Z_NAME_MAX]:
                'Name must be at most [%1] characters long.',
            [ZodErrors.Z_EMAIL_INVALID]: 'Please enter a valid email address.',
            [ZodErrors.Z_MESSAGE_MIN]:
                'Message must be at least [%1] characters long.',
            [ZodErrors.Z_MESSAGE_MAX]:
                'Message must be at most [%1] characters long.',
        },
    },
    [Language.IT]: {
        lang: Language.IT,
        form: {
            title: 'Contattaci',
            name: 'Nome',
            email: 'Email',
            message: 'Messaggio',
            submit: 'Invia Messaggio',
            successMessage:
                'Il messaggio è stato spedito. Grazie per averci contattato.',
        },
        errors: {
            [ZodErrors.Z_NAME_MIN]:
                'Il nome deve essere lungo almeno [%1] caratteri.',
            [ZodErrors.Z_NAME_MAX]:
                'Il nome non può essere più lungo di [%1] caratteri.',
            [ZodErrors.Z_EMAIL_INVALID]:
                'Per favore inserire un indirizzo email valido.',
            [ZodErrors.Z_MESSAGE_MIN]:
                'Il messaggio deve essere lungo almeno [%1] caratteri.',
            [ZodErrors.Z_MESSAGE_MAX]:
                'Il messaggio non può essere più lungo di [%1] caratteri.',
        },
    },
};

// This schema will be used to validate the input on the server.
const contactSchema = z.object({
    name: z.string()
        .min(
            FieldLimits.NAME_MIN,
            `${ZodErrors.Z_NAME_MIN}|${FieldLimits.NAME_MIN}`,
        )
        .max(
            FieldLimits.NAME_MAX,
            `${ZodErrors.Z_NAME_MAX}|${FieldLimits.NAME_MAX}`,
        ),

    email: z.string()
        .email(ZodErrors.Z_EMAIL_INVALID),

    message: z.string()
        .min(
            FieldLimits.MESSAGE_MIN,
            `${ZodErrors.Z_MESSAGE_MIN}|${FieldLimits.MESSAGE_MIN}`,
        )
        .max(
            FieldLimits.MESSAGE_MAX,
            `${ZodErrors.Z_MESSAGE_MAX}|${FieldLimits.MESSAGE_MAX}`,
        ),
});

// Define the type for the data passed to the page component.
// This will include potential errors, a success message, and submitted values.
type PageData = {
    success: boolean;
    errors?: z.ZodError['formErrors']['fieldErrors'];
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
        const acceptLanguageHeader = req.headers.get('Accept-Language');
        if (acceptLanguageHeader) {
            console.log('Accept-Language header:', acceptLanguageHeader);
            const lang = acceptLanguageHeader.split(',')[0].trim().split(
                '-',
            )[0]
                .toLowerCase() as Language;
            console.log('Detected language:', lang);
            if (lang in translations) {
                translation = translations[lang];
                console.log('Detected translation:', lang);
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
            const errors = validationResult.error.flatten().fieldErrors;
            console.error(
                'Validation failed:',
                errors,
            );

            translateErrors(errors, translation.errors);

            console.log('Translated errors:', errors);

            // Re-render the page, passing the errors and the data the user submitted.
            // This allows you to show error messages and keep the form populated.
            return ctx.render({
                success: false,
                translation,
                errors,
                submittedData: submittedData,
            });
        }

        // If validation succeeds...
        // In a real app, you would now send an email, save to a database, etc.
        console.log('Validation successful! Data:', validationResult.data);

        // Render the page with a success message.
        return ctx.render({ success: true, translation });
    },
};

// 3. Create the Page Component with Preact/JSX.
export default function ContactPage({ data }: PageProps<PageData>) {
    const t = data.translation!;
    const e = data.errors || {};
    console.log('Errors:', e);

    return (
        <div>
            <h1>
                {t.form.title}
            </h1>

            {!data.success && (
                <form method='POST' noValidate>
                    <input
                        type='hidden'
                        name={FieldNames.LANG}
                        value={t.lang}
                    />
                    <div>
                        <label for={FieldNames.NAME}>
                            {t.form.name}
                        </label><br/>
                        <input
                            type='text'
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
                        </label><br/>
                        <input
                            type='email'
                            id={FieldNames.EMAIL}
                            name={FieldNames.EMAIL}
                            defaultValue={data?.submittedData?.email}
                        />
                        {e?.email && <FieldErrorMessage message={e.email[0]} />}
                    </div>

                    <div>
                        <label for={FieldNames.MESSAGE}>
                            {t.form.message}
                        </label><br/>
                        <textarea
                            id={FieldNames.MESSAGE}
                            name={FieldNames.MESSAGE}
                            rows={4}
                            minLength={FieldLimits.MESSAGE_MIN}
                            maxLength={FieldLimits.MESSAGE_MAX}
                            style={{ width: '100%' }}
                            defaultValue={data?.submittedData?.message}
                        >
                        </textarea>
                        {e?.message && (
                            <FieldErrorMessage message={e.message[0]} />
                        )}
                    </div>

                    <div>
                        <button type='submit'>
                            {t.form.submit}
                        </button>
                        <LinkButton caption="Home" href="/" />
                    </div>
                </form>
            )}

            {data.success && (
                <div role='alert'>
                    <p>
                        {t.form.successMessage}
                    </p>
                    <p>
                        <LinkButton caption="Home" href="/" />
                    </p>
                </div>
            )}
        </div>
    );
}

function translateErrors(
    errors: any,
    translations: any,
) {
    for (const key in errors) {
        const value = errors[key];
        console.log('Translating error for key:', key, 'with value:', value);
        const message = Array.isArray(value) ? value[0] : value;

        const chunks = message.split('|');
        if (chunks.length > 1) {
            const errorKey = chunks[0].trim();
            if (errorKey in translations) {
                let t = translations[errorKey];
                for (let i = 1; i < chunks.length; i++) {
                    const param = chunks[i].trim();
                    t = t.replace(
                        '%' + i,
                        param,
                    );
                    errors[key] = [t];
                }
            }
        }
        else {
            const [errorKey] = chunks;
            if (errorKey in translations) {
                errors[key] = [translations[errorKey]];
            }
        }
        console.log('Translated error for key:', key, 'to:', errors[key]);
    }
}
