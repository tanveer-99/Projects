import { Alert, Button, TextInput } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import {useSelector} from 'react-redux'
import { app } from '../firebase.js'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
const DashProfile = () => {
    const {currentUser} = useSelector(state => state.user)
    const [imageFile, setImageFile] = useState(null)
    const [imageFileUrl, setImageFileUrl]= useState(null)
    const [uploadProgess, setUploadProgress] = useState(null)
    const [imageFileUploadError, setImageFileUploadError] = useState(null)
    const filePickerRef = useRef();
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if(file) {
            setImageFile(file)
            setImageFileUrl(URL.createObjectURL(file))
        }
        setImageFile(e.target.files[0])
    }
    useEffect(()=> {
        if(imageFile) {
            uploadImage()
        }
    }, [imageFile])

    const uploadImage = async ()=> {
        setImageFileUploadError(null)
        const storage = getStorage(app)
        const fileName = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
              // Track upload progress
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress.toFixed(0));
            },
            (error) => {
              setImageFileUploadError('Could not upload image (file must be less than 2 MB)')
              setUploadProgress(null)
              setImageFile(null)
              setImageFileUrl(null)
            },
            () => {
              // Handle successful upload and get the file's download URL
              getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                setImageFileUrl(url);
                setImageFile(null); // Reset file input
                setUploadProgress(null); // Reset progress
                
              });
            }
          );
        };


  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
        <form className='flex flex-col gap-4'>
            <input hidden ref={filePickerRef} type="file" accept='image/*'onChange={handleImageChange} />
            <div className='relative w-32 h-32 shadow-md rounded-full self-center overflow-hidden  cursor-pointer'>
                {uploadProgess > 0 && uploadProgess < 100 && 
                    <CircularProgressbar
                        value={uploadProgess || 0}
                        text={`${uploadProgess}%`}
                        strokeWidth={5}
                        styles={{
                            root: {
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                top: '0',
                                left: '0'
                            },
                            path: {
                                stroke: `rgba(62, 152, 199, ${uploadProgess/100})`
                            }
                        }}
                    ></CircularProgressbar>
                }
                <img className={` rounded-full w-full h-full border-8 border-[lightgray] object-cover ${uploadProgess && uploadProgess < 100 && 'opacity-60'}`} 
                src={imageFileUrl || currentUser.profilePicture}
                alt="user"
                onClick={()=>filePickerRef.current.click()} 
                />
            </div>
            {imageFileUploadError && 
            <Alert color='failure'>
                {imageFileUploadError}
            </Alert>}
            <TextInput
                type='text'
                id='username'
                placeholder='username'
                defaultValue={currentUser.username}
            ></TextInput>
            <TextInput
                type='text'
                id='email'
                placeholder='email'
                defaultValue={currentUser.email}
            ></TextInput>
            <TextInput
                type='password'
                id='password'
                placeholder='password'
            ></TextInput>
            <Button type='submit' gradientDuoTone='purpleToBlue' outline>Submit</Button>

        </form>
        <div className="text-red-500 flex justify-between mt-5">
            <span className='cursor-pointer'>Delete Account</span>
            <span className='cursor-pointer'>Sign Out</span>
        </div>
    </div>
  )
}

export default DashProfile