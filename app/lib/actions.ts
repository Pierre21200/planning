'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { auth } from '@/auth';



const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });


 
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
 
  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
 
  // Insert data into the database
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }
 
  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, prevState: State, formData: FormData) {
  
  const validatedFields= UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  } 


  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {

  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice.' };
  }
}

export async function getUserId() {
  const userAuth = await auth()
  const user = await sql`SELECT * FROM users WHERE email=${userAuth?.user?.email}`
  const userId = user.rows[0].id

  return userId;
}



export async function savePlanning(datas : any) {
  
  try {
    const userId = await getUserId();
       await sql `
       INSERT INTO planning (user_id, semaine, lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche)
       VALUES (
         ${userId},
         ${datas.Semaine[0]},
         ${datas.Lundi},
         ${datas.Mardi},
         ${datas.Mercredi},
         ${datas.Jeudi},
         ${datas.Vendredi},
         ${datas.Samedi},
         ${datas.Dimanche}
       )
       ON CONFLICT (user_id, semaine) DO NOTHING;
  `

  return 'Ajouter réussi'
  } catch (error) {
    console.error('Error saving planning:', error);
  }

  //  try {
  //   await sql `
  //   INSERT INTO planning (user_id, semaine, lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche)
  //   VALUES (
  //     ${userId},
  //     ${datas.Semaine[0]},
  //     ${datas.Lundi},
  //     ${datas.Mardi},
  //     ${datas.Mercredi},
  //     ${datas.Jeudi},
  //     ${datas.Vendredi},
  //     ${datas.Samedi},
  //     ${datas.Dimanche}
  //   )
  //   ON CONFLICT (semaine) DO UPDATE SET
  //     lundi = EXCLUDED.lundi,
  //     mardi = EXCLUDED.mardi,
  //     mercredi = EXCLUDED.mercredi,
  //     jeudi = EXCLUDED.jeudi,
  //     vendredi = EXCLUDED.vendredi,
  //     samedi = EXCLUDED.samedi,
  //     dimanche = EXCLUDED.dimanche;
  // `
  //  } catch (error) {
    
  //  }
}




export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}



