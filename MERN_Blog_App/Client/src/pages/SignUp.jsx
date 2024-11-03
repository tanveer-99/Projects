import { Button, Label, TextInput } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'

const SignUp = () => {
  return (
    <div className='min-h-screen mt-20'>
      <div className="flex p-3 max-w-4xl mx-auto flex-col md:flex-row md:items-center gap-8">
        <div className="flex-11">
          <Link to='/' className=' text-4xl font-bold dark:text-white'>
              <span className='px-2 py-1 rounded-lg text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400'>TANVIR's</span>
              Blog
          </Link>
          <p className='text-sm mt-5'>This is a demo project. You can sign in with your email and password or with Google.</p>
        </div>
        <div className="flex-1">
          <form className='flex flex-col gap-4'>
            <div>
              <Label value='Your username'></Label>
              <TextInput
              type='text'
              placeholder='username'
              id='username'
              ></TextInput>
            </div>
            <div>
              <Label value='Your email'></Label>
              <TextInput
              type='text'
              placeholder='name@company.com'
              id='email'
              ></TextInput>
            </div>
            <div>
              <Label value='Your password'></Label>
              <TextInput
              type='text'
              placeholder='password'
              id='password'
              ></TextInput>
            </div>
            <Button
            gradientDuoTone='purpleToPink' type='submit'> Sign Up</Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to='/sign-in' className='text-blue-500'>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp