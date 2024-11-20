import { Alert, Button, Modal, TextInput } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { app } from '../firebase.js'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { HiOutlineExclamationCircle} from 'react-icons/hi'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutSuccess, updateFailure, updateStart, updateSuccess } from '../redux/user/userSlice.js';
const DashProfile = () => {
    const {currentUser, error} = useSelector(state => state.user)
    const [imageFile, setImageFile] = useState(null)
    const [imageFileUrl, setImageFileUrl]= useState(null)
    const [uploadProgess, setUploadProgress] = useState(null)
    const [imageFileUploadError, setImageFileUploadError] = useState(null)
    const [imageFileUploading, setImageFileUploading] = useState(false)
    const [updateUserSuccess , setUpdateUserSuccess] = useState(null)
    const [updateUserError, setUpdateUserError] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const filePickerRef = useRef();
    const [formData, setFormData] = useState({})
    const dispatch = useDispatch()

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
        setImageFileUploading(true)
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
              setImageFileUploading(false)
            },
            () => {
              // Handle successful upload and get the file's download URL
              getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                setImageFileUrl(url);
                setImageFile(null); // Reset file input
                setUploadProgress(null); // Reset progress
                setFormData({...formData, profilePicture: url})
                setImageFileUploading(false)
              });
            }
          );
        };

    const handleChange = e => {
        setFormData({...formData, [e.target.id]:e.target.value})
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        setUpdateUserError(null)
        setUpdateUserSuccess(null)
        if(Object.keys(formData).length===0) {
            setUpdateUserError('No changes made!')
            return 
        }
        if(imageFileUploading) {
            setUpdateUserError('Please wait for image to upload!')
            return
        }
        console.log(formData)
        try {
            dispatch(updateStart())
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            console.log(data)
            if(!res.ok) {
                dispatch(updateFailure(data.message))
                setUpdateUserError(data.message)
            }
            else {
                dispatch(updateSuccess(data))
                setUpdateUserSuccess("User Profile Updated Successfully!")
            }
        } catch (error) {
            dispatch(updateFailure(error.message))
            setUpdateUserError(error.message)
        }
    }
    const handleDeleteUser = async()=> {
        setShowModal(false)
        try {
            dispatch(deleteUserStart())
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE'
            })
            const data = await res.json()
            if(!res.ok) {
                dispatch(deleteUserFailure(data.message))
            }
            else {
                dispatch(deleteUserSuccess(data))
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.message))
        }
    }
    const handleSignOut = async () => {
        try {
            const res = await fetch('/api/user/signout', {
                method: 'POST'
            })
            const data = await res.json()
            if(!res.ok) {
                console.log(data.message)
            }
            else {
                dispatch(signOutSuccess())
            }
        } catch (error) {
            console.log(error.message)
        }
    }
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
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
                onChange={handleChange}
            ></TextInput>
            <TextInput
                type='text'
                id='email'
                placeholder='email'
                defaultValue={currentUser.email}
                onChange={handleChange}
            ></TextInput>
            <TextInput
                type='password'
                id='password'
                placeholder='password'
                onChange={handleChange}
            ></TextInput>
            <Button type='submit' gradientDuoTone='purpleToBlue' outline>Update User</Button>

        </form>
        <div className="text-red-500 flex justify-between mt-5">
            <span onClick={()=> setShowModal(true)} className='cursor-pointer'>Delete Account</span>
            <span onClick={handleSignOut} className='cursor-pointer'>Sign Out</span>
        </div>
        {updateUserSuccess && 
            <Alert color='success' className='mt-5'>{updateUserSuccess}</Alert>
        }
        {updateUserError && 
            <Alert color='failure' className='mt-5'>{updateUserError}</Alert>
        }
        {error &&
            <Alert color='failure' className='mt-5'>{updateUserError}</Alert> 
        }
        <Modal show={showModal} onClose={()=> setShowModal(false)} popup size='md'>
            <Modal.Header></Modal.Header>
            <Modal.Body>
                <div className="text-center">
                    <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'></HiOutlineExclamationCircle>
                    <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete your account?</h3>
                    <div className='flex justify-center gap-4'>
                        <Button color='failure' onClick={handleDeleteUser}>Yes, I'm sure.</Button>
                        <Button color='gray' onClick={()=>setShowModal(false)}>NO, cancel.</Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    </div>
  )
}

export default DashProfile