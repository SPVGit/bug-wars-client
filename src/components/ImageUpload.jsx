
import { useState, useContext, useEffect } from "react"
import { AuthContext } from "../context/auth.context"
import axios from 'axios';
import { Container } from "react-bootstrap";
import {Button} from "react-bootstrap"
//import loadingGif from './spinner.gif';

const API_URL = process.env.REACT_APP_API_URL
const CLOUDINARY_URL = process.env.REACT_APP_CLOUDINARY_URL
const PRESET = process.env.REACT_APP_PRESET

function ImageUpload() {

    const { user } = useContext(AuthContext)

    const [image, setImage] = useState('');
    const [file, setFile] = useState({})
    const [loading, setLoading] = useState(false);

    const storedToken = localStorage.getItem("authToken")


    const onChange = e => {
        setFile(e.target.files[0]);
    };

    const onSubmit = async () => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', PRESET);
        try {
            setLoading(true);
            const res = await axios.post(`${CLOUDINARY_URL}/image/upload`, formData);
            const imageUrl = res.data.secure_url;
            const image = await axios.put(`${API_URL}/upload/${user._id}`, {
                picture:imageUrl
            }, {
                headers: { Authorization: `Bearer ${storedToken}` }
              });
            setLoading(false);
            setImage(image.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        async function fetchImage() {
            const image = await axios.get(`${API_URL}/getLatest/${user._id}`,{
                headers: { Authorization: `Bearer ${storedToken}` }
              } );
            setImage(image.data);
        }
        fetchImage();
        // eslint-disable-next-line
    }, []);
    return (
        <Container className="d-flex flex-row justify-content-between p-5 border rounded">
            <img src={image} style={{ width: 100, height: 100 }} className="border rounded bg-light mt-2 col-4 col-sm-4 col-md-4" />
         
                
                <div className='d-flex flex-column justify-content-center col-8 col-sm-8 col-md-8'>
                   
                        
                        <input className="border rounded bg-white text-dark mb-2" type='file' name='image' onChange={onChange} />
                    
               {loading ? <Button onClick={onSubmit} className='rounded text-white p-2' variant="dark">
                        Uploading Image...
                    </Button> :  <Button onClick={onSubmit} className='rounded text-white p-2' variant="dark">
                        Submit
                    </Button>}
               

                   
                </div>
          
        </Container>
    )

}

export default ImageUpload