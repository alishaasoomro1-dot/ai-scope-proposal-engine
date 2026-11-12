"use client";

import { useState, type FormEvent } from "react";
import { Sparkles, Wand2, Loader2 } from "lucide-react";

import CopyButton from "./CopyButton";
import { Card, btn, input } from "./Ui";


type Job = {
  id: number;
  title: string;
  description: string;
  budget?: number | null;
};


const LABEL = {
  analyze: "Analyze Job",
  proposal: "Generate Proposal",
  scope: "Generate Scope",
} as const;


export default function AiTool({
  kind,
  jobs = [],
  initial,
}: {
  kind: keyof typeof LABEL;
  jobs?: Job[];
  initial?: { title: string; description: string; jobId?: number; analysisId?: number };
}) {

  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [jobId, setJobId] = useState<number | undefined>(initial?.jobId);
  const [analysisId, setAnalysisId] = useState<number | undefined>(initial?.analysisId);
  const [budget, setBudget] = useState("");
  const [platform, setPlatform] = useState("");
  const [deadline, setDeadline] = useState("");
  const [country, setCountry] = useState("");

  const [out, setOut] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  function pick(value: string) {

    const job = jobs.find(
      (x) => String(x.id) === value
    );

    setJobId(job?.id);
    setAnalysisId(undefined);
    setBudget(job?.budget == null ? "" : String(job.budget));

    if (job) {
      setTitle(job.title);
      setDescription(job.description);
    }

  }


  async function run(e: FormEvent) {

    e.preventDefault();

    setLoading(true);
    setError("");
    setOut("");

    try {

      const response = await fetch(
        `/api/ai/${kind}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            title,
            description,
            jobId,
            analysisId,
            budget: budget === "" ? undefined : Number(budget),
            platform: platform || undefined,
            deadline: deadline || undefined,
            country: country || undefined,
          }),
        }
      );


      const data = await response.json() as {
        output?: string;
        error?: string;
        analysisId?: number;
      };


      if (!response.ok) {

        setError(
          data.error ?? "Something went wrong."
        );

      } else {

        setAnalysisId(data.analysisId);
        setOut(
          data.output ?? ""
        );

      }


    } catch {

      setError(
        "Network error. Please try again."
      );

    } finally {

      setLoading(false);

    }

  }



  return (

    <div className="grid gap-6 lg:grid-cols-2">


      {/* INPUT */}

      <Card className="rounded-3xl border-[#E5E7EB] shadow-sm">


        <div className="mb-6 flex items-center gap-3">

          <div className="rounded-xl bg-[#16A34A] p-3 text-white">
            <Sparkles size={22}/>
          </div>


          <div>

            <h2 className="font-bold text-[#111827]">
              AI {LABEL[kind]}
            </h2>

            <p className="text-sm text-[#6B7280]">
              Generate professional freelance content instantly.
            </p>

          </div>

        </div>



        <form
          onSubmit={run}
          className="space-y-5"
          aria-busy={loading}
        >


          {
            jobs.length > 0 && (

              <label className="block text-sm font-medium text-[#111827]">

                Select Existing Job

                <select
                  className={`${input} mt-2`}
                  defaultValue={initial?.jobId ? String(initial.jobId) : ""}
                  onChange={(e)=>pick(e.target.value)}
                >

                  <option value="">
                    Create from scratch
                  </option>


                  {
                    jobs.map((job)=>(

                      <option
                        key={job.id}
                        value={job.id}
                      >
                        {job.title}
                      </option>

                    ))
                  }


                </select>


              </label>

            )
          }



          <label className="block text-sm font-medium text-[#111827]">

            Job Title

            <input
              className={`${input} mt-2`}
              value={title}
              onChange={(e)=>{ setTitle(e.target.value); setAnalysisId(undefined); }}
              placeholder="Example: React Developer"
              required
            />

          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-medium text-[#111827]">Budget<input type="number" min="0" max="1000000000" className={`${input} mt-2`} value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Not specified" /></label>
            <label className="block text-sm font-medium text-[#111827]">Platform<input className={`${input} mt-2`} value={platform} onChange={(e) => setPlatform(e.target.value)} placeholder="e.g. Upwork" maxLength={80} /></label>
            <label className="block text-sm font-medium text-[#111827]">Deadline<input className={`${input} mt-2`} value={deadline} onChange={(e) => setDeadline(e.target.value)} placeholder="As provided by client" maxLength={120} /></label>
            <label className="block text-sm font-medium text-[#111827]">Client country<input className={`${input} mt-2`} value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Optional" maxLength={100} /></label>
          </div>




          <label className="block text-sm font-medium text-[#111827]">

            Job Description


            <textarea
              className={`${input} mt-2 h-52 resize-none`}
              value={description}
              onChange={(e)=>{ setDescription(e.target.value); setAnalysisId(undefined); }}
              placeholder="Paste job requirements here..."
              required
            />

          </label>



          {
            error && (

              <div role="alert" className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-3 text-sm text-[#111827]">

                {error}

              </div>

            )
          }



          <button
            className={`${btn} flex w-full gap-2`}
            disabled={loading}
          >

            {
              loading ? (
                <>
                  <Loader2
                    className="animate-spin"
                    size={18}
                  />
                  Processing...
                </>
              )
              :
              (
                <>
                  <Wand2 size={18}/>
                  {LABEL[kind]}
                </>
              )
            }


          </button>


        </form>


      </Card>




      {/* OUTPUT */}


      <Card className="rounded-3xl border-[#E5E7EB] shadow-sm">


        <div className="mb-5 flex items-center justify-between">

          <div>

            <h2 className="font-bold text-[#111827]">
              AI Result
            </h2>

            <p className="text-sm text-[#6B7280]">
              Your generated content appears here.
            </p>

          </div>


          {
            out && (
              <CopyButton text={out}/>
            )
          }


        </div>



        {
          loading ? (

            <div className="flex items-center gap-3 text-sm text-[#6B7280]">

              <Loader2
                className="animate-spin"
                size={18}
              />

              AI is generating your result...

            </div>

          )

          :

          out ? (

            <pre className="whitespace-pre-wrap rounded-xl bg-[#F8FAFC] p-5 text-sm leading-7 text-[#111827]">

              {out}

            </pre>

          )

          :

          (

            <div className="rounded-xl border border-dashed border-[#E5E7EB] p-10 text-center">

              <Sparkles
                className="mx-auto mb-3 text-[#6B7280]"
              />

              <p className="text-sm text-[#6B7280]">
                Your AI generated result will appear here.
              </p>

            </div>

          )

        }


      </Card>


    </div>

  );

}
