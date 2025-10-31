  "use client";
  import { handelUsersPresents } from "@/lib/Presents";
  import { store } from "@/store";
  import { Employee } from "@/types";
  import { UserRoundPlus } from "lucide-react";
  import React, { FormEvent, useState } from "react";

  const Hr = () => {
    const [open, setOpen] = useState(false);
    const [text, settext] = useState<String>("");
    const openclose = () => (open ? setOpen(false) : setOpen(true));
    const { data, setdata } = store();
    async function HendleAddEmployes() {
      
      try {
       if(text.length < 6 ) return false 
        const date = new Date().getDay();
        const updateuser = data.map((user) =>
          text.includes(user.Matricule)
            ? { ...user, status: "active" }
            : { ...user, status: "inactive" }
        ) as Employee[];
        setdata(updateuser);
        const responseTodelet = await fetch(
          "https://sheetdb.io/api/v1/s6vt0lc3cghvn/all",
          {
            method: "DELETE",
          }
        );
        const isok = await responseTodelet.json();
        console.log(isok);
        const responseToUpdate = await fetch(
          "https://sheetdb.io/api/v1/s6vt0lc3cghvn",
          {
            method: "POST",
            cache: "no-cache",
            body: JSON.stringify(updateuser),
            headers: {
              "Content-Type": "application/json",
            },
            referrerPolicy: "same-origin",
          }
        );
        const ok = await responseToUpdate.json();
        console.log(ok);
      } catch (error) {
        console.log(error);
      }
    }
    return (
      <>
              <button onClick={openclose} className='w-40 cursor-pointer h-11 bg-tgcc-500 text-white rounded-md'>Get started</button>

        {open && (
          <div className="w-full fixed z-20 bg-neutral-900/5 flex justify-center items-center inset-0">
            <div className="bg-white flex flex-col gap-1.5  p-2 w-1/2 h-max rounded-md border border-neutral-200">
              <h1>Add new </h1>
              <div className="flex flex-col gap-2">
                <textarea
                  onChange={(e) => settext(e.currentTarget.value)}
                  className="w-full h-28 resize-none input"
                  name="data"
                  id=""
                ></textarea>

                <div className="flex justify-between gap-2 items-center">
                  <button
                    onClick={openclose}
                    className="w-[20%] h-11 border border-neutral-200  rounded-md cursor-pointer "
                  >
                    cancel
                  </button>

                  <button
                    onClick={HendleAddEmployes}
                    className="w-full h-11 bg-blue-500 text-white rounded-md cursor-pointer "
                  >
                    Run 
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  export default Hr;
