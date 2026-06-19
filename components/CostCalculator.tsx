"use client";

import { useState } from "react";
import { DollarSign, TrendingDown, BadgeDollarSign } from "lucide-react";

export default function CostCalculator() {

  const data = {

    Cardiology: {
      india: 7000,
      abroad: 120000,
    },

    Orthopedics: {
      india: 5000,
      abroad: 45000,
    },

    Oncology: {
      india: 10000,
      abroad: 60000,
    },

    IVF: {
      india: 3000,
      abroad: 15000,
    },

    "Kidney Transplant": {
      india: 12000,
      abroad: 250000,
    },

    "Liver Transplant": {
      india: 30000,
      abroad: 200000,
    },

  };



  const formatMoney = (value: number) => {

    return value.toLocaleString("en-US");

  };



  const [treatment, setTreatment] =

    useState<keyof typeof data>("Cardiology");



  const selected = data[treatment];



  const savings =

    selected.abroad - selected.india;



  const savingPercent = Math.round(

    (savings / selected.abroad) * 100

  );



  return (

    <section className="relative overflow-hidden py-20 lg:py-28 bg-gradient-to-b from-black via-slate-950 to-black">



      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[150px]" />



      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[150px]" />





      <div className="relative max-w-7xl mx-auto px-5 lg:px-6">



        <div className="text-center">



          <div

            className="

            inline-flex

            items-center

            gap-2

            px-5

            py-2

            rounded-full

            border

            border-blue-500/20

            bg-blue-500/10

            text-blue-300

            text-sm

            "

          >

            <BadgeDollarSign size={18} />

            Cost Calculator

          </div>



          <h2

            className="

            mt-8

            text-4xl

            md:text-5xl

            lg:text-7xl

            font-bold

            leading-tight

            "

          >

            Compare Treatment

            <br />

            Costs Instantly

          </h2>



          <p

            className="

            max-w-3xl

            mx-auto

            mt-8

            text-slate-400

            text-base

            md:text-lg

            lg:text-xl

            "

          >

            Discover how much you can save by

            choosing world-class healthcare

            in India.

          </p>



        </div>





        <div

          className="

          mt-14

          rounded-[32px]

          border

          border-slate-800

          bg-slate-950/70

          backdrop-blur-2xl

          p-6

          lg:p-10

          shadow-[0_0_70px_rgba(59,130,246,0.12)]

          "

        >



          <label

            className="

            text-slate-300

            text-sm

            mb-3

            block

            "

          >

            Select Treatment

          </label>



          <select

            value={treatment}

            onChange={(e) =>

              setTreatment(

                e.target.value as keyof typeof data

              )

            }

            className="

            w-full

            bg-slate-900

            border

            border-slate-700

            rounded-2xl

            px-5

            py-4

            text-white

            text-lg

            outline-none

            focus:border-blue-500

            transition

            "

          >

            {

              Object.keys(data).map((item) => (

                <option

                  key={item}

                  value={item}

                >

                  {item}

                </option>

              ))

            }

          </select>





          <div

            className="

            grid

            grid-cols-1

            md:grid-cols-3

            gap-6

            mt-10

            "

          >





            <div

              className="

              rounded-[28px]

              p-8

              border

              border-blue-500/20

              bg-gradient-to-br

              from-blue-500/10

              to-blue-950

              "

            >



              <DollarSign

                className="text-blue-400"

                size={34}

              />



              <h3

                className="

                mt-6

                text-slate-300

                font-medium

                "

              >

                Treatment In India

              </h3>



              <p

                className="

                text-4xl

                lg:text-5xl

                font-bold

                text-blue-400

                mt-4

                break-words

                "

              >

                $

                {formatMoney(

                  selected.india

                )}

              </p>



            </div>







            <div

              className="

              rounded-[28px]

              p-8

              border

              border-red-500/20

              bg-gradient-to-br

              from-red-500/10

              to-red-950

              "

            >



              <TrendingDown

                className="text-red-400"

                size={34}

              />



              <h3

                className="

                mt-6

                text-slate-300

                font-medium

                "

              >

                USA / UK Cost

              </h3>



              <p

                className="

                text-4xl

                lg:text-5xl

                font-bold

                text-red-400

                mt-4

                break-words

                "

              >

                $

                {formatMoney(

                  selected.abroad

                )}

              </p>



            </div>







            <div

              className="

              rounded-[28px]

              p-8

              border

              border-green-500/20

              bg-gradient-to-br

              from-green-500/10

              to-green-950

              "

            >



              <BadgeDollarSign

                className="text-green-400"

                size={34}

              />



              <h3

                className="

                mt-6

                text-slate-300

                font-medium

                "

              >

                Potential Savings

              </h3>



              <p

                className="

                text-4xl

                lg:text-5xl

                font-bold

                text-green-400

                mt-4

                break-words

                "

              >

                $

                {formatMoney(

                  savings

                )}

              </p>



              <div

                className="

                mt-5

                inline-flex

                px-4

                py-2

                rounded-full

                bg-green-500/15

                border

                border-green-500/20

                text-green-400

                font-semibold

                "

              >

                Save {savingPercent}%

              </div>



            </div>



          </div>

        </div>

      </div>

    </section>

  );

}