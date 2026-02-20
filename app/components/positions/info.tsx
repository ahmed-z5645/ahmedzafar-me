import jobs from "../../data/jobs.json";

export default function Info() {
    return(
        <div>
            {jobs.map((job) => (
                <div key={job.id}>
                    <div>
                        {job.date}
                        { job.note && (
                            <div>{job.note}</div>
                        )}
                    </div>
                    <div>
                        {job.company}
                    </div>
                    <ul className="list-disc ml-5 space-y-1 text-sm text-neutral-500">
                        {job.description.map((bulletPoint, index) => (
                            <li key={index}>
                            {bulletPoint}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    )
}