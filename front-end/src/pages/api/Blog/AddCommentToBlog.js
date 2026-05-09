import axios from 'axios';

async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const { blogId } = req.query;

    try{
        const addComment = await axios.post(`https://kemet-gold.vercel.app/blog/addComment/${blogId}` ,req.body, {
                headers: {
                    cookies: req.headers.cookie || '',
                },
                withCredentials: true,
            });
        res.status(200).json({ message: 'Comment added successfully', comment: addComment.data });
    }catch(error){
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


export default handler;