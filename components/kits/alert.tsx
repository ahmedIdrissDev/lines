"use client";

import { api } from "@/convex/_generated/api";
import { Userreception } from "@/types";
import { useQuery } from "convex/react";
import { AnimatePresence , motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";

const Alert = () => {
  const [open, setOpen] = useState(false);
  const openclose = () => (open ? setOpen(false) : setOpen(true));
  const [text, settext] = useState<string>("");
  
  const [reseption, setReception] = useState<Userreception[]>([]);
const user = useQuery(api.functions.login.getUsers);
  const getbyname = user?.filter(({ name }) =>
    name.toLowerCase().includes(text.toLowerCase())
  );
    function handleAddReception(data: Userreception) {
    setReception((e) => [...e, data]);
    settext("");
  }
  return (
    <>
      <div className="flex  h-full gap-2 flex-col justify-center items-center">
        <div className="flex items-center justify-center ">
<svg className="w-50" width="303" height="40" viewBox="0 0 303 303" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 227.25V207.366C0 198.318 4.62917 190.953 13.8875 185.272C23.1458 179.591 35.35 176.75 50.5 176.75C53.2354 176.75 55.8656 176.803 58.3906 176.908C60.9156 177.013 63.3354 177.276 65.65 177.697C62.7042 182.116 60.4948 186.745 59.0219 191.584C57.549 196.424 56.8125 201.474 56.8125 206.734V227.25H0ZM75.75 227.25V206.734C75.75 200.001 77.5911 193.846 81.2734 188.27C84.9557 182.694 90.1635 177.802 96.8969 173.594C103.63 169.385 111.679 166.229 121.042 164.125C130.406 162.021 140.558 160.969 151.5 160.969C162.652 160.969 172.91 162.021 182.273 164.125C191.637 166.229 199.685 169.385 206.419 173.594C213.152 177.802 218.307 182.694 221.884 188.27C225.461 193.846 227.25 200.001 227.25 206.734V227.25H75.75ZM246.188 227.25V206.734C246.188 201.264 245.504 196.108 244.136 191.269C242.768 186.429 240.717 181.905 237.981 177.697C240.296 177.276 242.663 177.013 245.083 176.908C247.503 176.803 249.975 176.75 252.5 176.75C267.65 176.75 279.854 179.538 289.113 185.114C298.371 190.69 303 198.107 303 207.366V227.25H246.188ZM102.578 202H200.738C198.633 197.792 192.794 194.109 183.22 190.953C173.646 187.797 163.073 186.219 151.5 186.219C139.927 186.219 129.354 187.797 119.78 190.953C110.206 194.109 104.472 197.792 102.578 202ZM50.5 164.125C43.5563 164.125 37.612 161.653 32.6672 156.708C27.7224 151.763 25.25 145.819 25.25 138.875C25.25 131.721 27.7224 125.724 32.6672 120.884C37.612 116.045 43.5563 113.625 50.5 113.625C57.6542 113.625 63.651 116.045 68.4906 120.884C73.3302 125.724 75.75 131.721 75.75 138.875C75.75 145.819 73.3302 151.763 68.4906 156.708C63.651 161.653 57.6542 164.125 50.5 164.125ZM252.5 164.125C245.556 164.125 239.612 161.653 234.667 156.708C229.722 151.763 227.25 145.819 227.25 138.875C227.25 131.721 229.722 125.724 234.667 120.884C239.612 116.045 245.556 113.625 252.5 113.625C259.654 113.625 265.651 116.045 270.491 120.884C275.33 125.724 277.75 131.721 277.75 138.875C277.75 145.819 275.33 151.763 270.491 156.708C265.651 161.653 259.654 164.125 252.5 164.125ZM151.5 151.5C140.979 151.5 132.036 147.818 124.672 140.453C117.307 133.089 113.625 124.146 113.625 113.625C113.625 102.894 117.307 93.8984 124.672 86.6391C132.036 79.3797 140.979 75.75 151.5 75.75C162.231 75.75 171.227 79.3797 178.486 86.6391C185.745 93.8984 189.375 102.894 189.375 113.625C189.375 124.146 185.745 133.089 178.486 140.453C171.227 147.818 162.231 151.5 151.5 151.5ZM151.5 126.25C155.077 126.25 158.076 125.04 160.495 122.62C162.915 120.201 164.125 117.202 164.125 113.625C164.125 110.048 162.915 107.049 160.495 104.63C158.076 102.21 155.077 101 151.5 101C147.923 101 144.924 102.21 142.505 104.63C140.085 107.049 138.875 110.048 138.875 113.625C138.875 117.202 140.085 120.201 142.505 122.62C144.924 125.04 147.923 126.25 151.5 126.25Z" fill="url(#paint0_linear_2013_4)"/>
<defs>
<linearGradient id="paint0_linear_2013_4" x1="151.5" y1="75.75" x2="151.5" y2="227.25" gradientUnits="userSpaceOnUse">
<stop stop-color="#93BFFF"/>
<stop offset="1" stop-color="#003E99"/>
</linearGradient>
</defs>
</svg>
        </div>
        <div className="flex items-center flex-col gap-2">
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-2xl">Create your Team</h1>
            <p className="text-sm ">Build and manage your team in one place</p>
          </div>
            <button
             onClick={openclose}
             className="w-50 hidden  group cursor-pointer rounded-md md:flex justify-center items-center gap-1.5 h-11 border-t-2 border-tgcc-500  bg-tgcc-600  text-white"
             >
            <span className="material-symbols-outlined group-hover:-translate-x-2 duration-150">
              bookmark_manager
            </span>
            <span> new workspace </span>
          </button>{" "}
        </div>
      </div>
      <AnimatePresence>


      {open && (
        <div className="inset-0  fixed flex justify-center items-center w-full h-full bg-neutral-950/20">
          <motion.div 
           initial={{opacity:0 , translateY:0}}
           animate={{opacity:1 , translateY:2}}
           exit={{opacity:0 , translateY:0}}

          className="w-1/2  min-h-11 h-max bg-white rounded-md">
            <div className="w-full p-3 gap-2 flex flex-col justify-between h-full ">
              <div className="">
                <h1>Create workspace</h1>
              </div>
              <div className="w-full flex flex-col gap-2 ">
                <input
                  type="text"
                  className="input"
                  placeholder="CHU RABAT etc.."
                />
                <input
                    
                    type="text"
                    onChange={(e) => settext(e.currentTarget.value)}
                    className="w-full h-11 border border-neutral-200   outline-0  rounded-2xl px-2"
                    placeholder="User"
                  />
                <div className="w-full p-1.5 grid grid-cols-2 gap-2 min-h-12 h-max rounded-xl border border-neutral-200">
              {text && (
                <div className="w-96 p-3 absolute top-32 bg-white z-40 h-max border border-neutral-100 rounded-2xl">
                  {getbyname.map((data, index) => (
                    <div
                      key={index}
                      onClick={() => handleAddReception(data)}
                      className="w-full cursor-pointer p-2 hover:bg-neutral-50 rounded-xl h-12 flex items-center gap-2"
                    >
                      <img
                        src={data.image}
                        className="w-11 h-11 rounded-full"
                      />
                      <div className="">
                        <h1 className="text-sm">{data.email} </h1>
                        <span className="text-sm opacity-90">{data.name} </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
                                {reseption.map(({ name, email, image }, index) => (
                                  <div
                                    key={index}
                                    className="w-max  cursor-pointer bg-tgcc-50 p-1 border border-neutral-100 hover:bg-neutral-50 rounded-full h-12 flex items-center gap-2"
                                  >
                                    <img src={image} className="w-10 h-10 rounded-full" />
              
                                    <div className="">
                                      <input
                                        type="text"
                                        readOnly
                                        value={email}
                                        name="receptionId"
                                        hidden
                                      />
                                      <span className="text-sm opacity-90">
                                      {name}
                                      </span>
                                    </div>
                                      <Image
                                                          className="w-4"
                                                          src={"/check.png"}
                                                          width={1000}
                                                          height={1000}
                                                          alt="logo"
                                                        />
                                  </div>
                                ))}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={openclose}
                  className="w-50 hidden cursor-pointer rounded-md md:flex justify-center items-center gap-1.5 h-11 border border-neutral-200 text-neutral-600"
                >
                  <span> cancel </span>
                </button>
                <button className="w-50 hidden cursor-pointer rounded-md md:flex justify-center items-center gap-1.5 h-11  border-t-2 border-tgcc-500    bg-tgcc-600  text-white">
                  <span className="material-symbols-outlined">
create_new_folder
</span>
                  <span> Create </span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
            </AnimatePresence>

    </>
  );
};

export default Alert;
