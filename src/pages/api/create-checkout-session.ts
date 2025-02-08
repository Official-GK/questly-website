import { createCheckoutSession } from '@/api/stripe';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { priceId } = req.body;

    const session = await createCheckoutSession(
      priceId,
      `${import.meta.env.VITE_APP_URL}/subscription/success`,
      `${import.meta.env.VITE_APP_URL}/subscription/cancel`
    );

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Error in create-checkout-session:', error);
    res.status(500).json({ message: 'Error creating checkout session' });
  }
}
