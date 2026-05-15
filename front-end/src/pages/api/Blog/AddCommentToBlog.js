import axios from 'axios';

const API_BASE_URL =
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:8000";

async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const { blogId } = req.query;

    try{
        const addComment = await axios.post(`${API_BASE_URL}/api/blog/addComment/${blogId}` ,req.body, {
                headers: {
                    Cookie: req.headers.cookie || '',
                },
                withCredentials: true,
            });
        res.status(200).json({ message: 'Comment added successfully', comment: addComment.data });
    }catch(error){
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


export default handler;
