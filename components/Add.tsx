"use client";
import { store } from "@/store";
import { User, UserRoundPlus } from "lucide-react";
import React, { FormEvent, useState } from "react";

const Add = () => {
  const [open, setOpen] = useState(false);
  const openclose = () => (open ? setOpen(false) : setOpen(true));
  const { data } = store();
  const grup = Object.groupBy(data, ({ lot }) => lot);
  const fun = Object.groupBy(data, ({ function: fun }) => fun);

  const key = Object.keys(grup);
  const funs = Object.keys(fun);

  async function HendleAddEmployes(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fromdata = new FormData(e.currentTarget);
     const data = Object.fromEntries(fromdata.entries())
     console.log(data)
    // const response = await fetch("https://sheetdb.io/api/v1/s6vt0lc3cghvn", {
    //   method: "POST",
    //   body: JSON.stringify(data),
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    // const req = await response.json();
    try {
    } catch (error) {}
  }
  return (
    <>
      <button
        onClick={openclose}
        className="w-30 hidden cursor-pointer rounded-md  md:flex justify-center items-center gap-1.5 h-9 bg-tgcc-700 text-white"
      >
        <span> Add Employee </span>
      </button>
      {open && (
        <div className="w-full fixed z-20 bg-neutral-900/5 flex justify-center items-center inset-0">
          <div className="bg-white flex flex-col gap-1.5  p-2 w-1/2 h-max rounded-md border border-neutral-200">
            <h1>Add new </h1>
            <form className="flex flex-col gap-2" onSubmit={HendleAddEmployes}>
              <div className="flex flex-col gap-1">
                <label htmlFor="">Code</label>
                <input
                  className="input"
                  required
                  name="M"
                  minLength={1}
                  type="number"
                  placeholder="Code"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="">Full name</label>
                <div className="flex justify-between items-center gap-2">
                  <input
                    className="input"
                    required
                    name="hhe"
                    minLength={1}
                    type="text"
                    placeholder="Full name"
                  />
                  <input
                    className="input"
                    required
                    minLength={1}
                    name="kjak"
                    type="text"
                    placeholder="Full name"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="">Lot</label>
                <select name="hello"  className="input text-blue-700" id="fruits">
                  {key.map((ke) => (
                    <option className="text-tgcc-200" key={ke} value={ke}>
                      {" "}
                      {ke}.CHU@tgcc{" "}
                    </option>
                  ))}
                  <option value="Apple"></option>
                </select>{" "}
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="">function</label>
                <select name="" className="input" id="fruits">
                  {funs.map((ke) => (
                    <option key={ke} value={ke}>
                      {" "}
                      {ke}{" "}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-between gap-2 items-center">
                <button
                  onClick={openclose}
                  className="w-[20%] h-11 border border-neutral-200  rounded-md cursor-pointer "
                >
                  cancel
                </button>

                <button className="w-full h-11 bg-tgcc-900 text-white rounded-md cursor-pointer ">
                  Add new Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Add;
