import { Footer } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { BsFacebook, BsInstagram, BsTwitter, BsGithub } from 'react-icons/bs'

const FooterComponent = () => {
  return (
    <Footer container className='border border-t-8 border-teal-500'>
      <div className=" w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="mt-5">
            <Link to='/' className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'>
              <span className='px-2 py-1 rounded-lg text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400'>TANVIR's</span>
              Blog
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-8 mt-4 sm:grid-col-3 sm:gap-6">
            <div>
              <Footer.Title title='About'></Footer.Title>
              <Footer.LinkGroup col>
                <Footer.Link href='https://www.google.com' target='_blank' rel='noopener noreferrer'>
                  100 JS Projects
                </Footer.Link>
                <Footer.Link href='/about' target='_blank' rel='noopener noreferrer'>
                  Tanvir's Blog
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title='Follow Us'></Footer.Title>
              <Footer.LinkGroup col>
                <Footer.Link href='https://www.github.com' target='_blank' rel='noopener noreferrer'>
                  github
                </Footer.Link>
                <Footer.Link href='#' target='_blank' rel='noopener noreferrer'>
                  linkedin
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title='Legal'></Footer.Title>
              <Footer.LinkGroup col>
                <Footer.Link href='#' target='_blank' rel='noopener noreferrer'>
                  privacy Policy
                </Footer.Link>
                <Footer.Link href='#' target='_blank' rel='noopener noreferrer'>
                  Terms & Conditions
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider></Footer.Divider>
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright href='#' by="Tanvir's Blog" year={new Date().getFullYear()}></Footer.Copyright>
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <Footer.Icon href='#' icon={BsFacebook}></Footer.Icon>
            <Footer.Icon href='#' icon={BsInstagram}></Footer.Icon>
            <Footer.Icon href='#' icon={BsGithub}></Footer.Icon>
            <Footer.Icon href='#' icon={BsTwitter}></Footer.Icon>
          </div>
        </div>
      </div>
    </Footer>
  )
}

export default FooterComponent