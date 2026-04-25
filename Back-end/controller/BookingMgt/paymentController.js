const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const domain = process.env.DOMAIN;


const stripeCheckout = async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            success_url: `${domain}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${domain}/checkout?payment_fail=true`,
            metadata: {order: JSON.stringify(req.body)},
            line_items: req.body.items.map(item => ({
                price_data: {
                    currency: "egp",
                    product_data: {
                        name: item.name,
                        description: item.description,
                        images: [item.image]
                    },
                    unit_amount: item.price
                },
                quantity: item.quantity
            }))
        });
        res.json(session.url);

    } catch (err) {
        console.error("Stripe checkout error:", err.message);
        res.status(500).json({error: err.message});
    }
};

const success = async (req, res) => {
    const {session_id} = req.query;

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);
        const customerEmail = session.customer_details.email;
        const order = JSON.parse(session.metadata.order);
        const date = new Date();
        const orders_collection = collection(db, "orders");
        const docName = `${customerEmail}-order-${date.getTime()}`;

        await setDoc(doc(orders_collection, docName), order);
        res.redirect('/checkout?payment=done');

    } catch (err) {
        console.log(err);
        res.status(400).json({error: "Failed to retrieve payment session"});
    }
};

module.exports = {stripeCheckout, success};