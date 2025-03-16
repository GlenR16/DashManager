const messages: string[] = [
    "Downloading more RAM",
    "Warming up the servers",
    "Feeding the hamsters",
    "Polishing the UI",
    "Flushing the cache",
    "Cooking the books",
    "Crunching the numbers",
    "Waking up the developers",
    "Double checking the bits",
    "Deploying skynet to cloud",
    "Reticulating splines",
    "Testing the users patience",
    "Dividing by zero",
    "Loading the loading screen",
    "Removing indents from the codebase",
    
];

export default function Loading(): React.ReactElement {

    return (
        <div className="grow h-full w-full flex flex-col items-center justify-center gap-4">
            <div className="flex flex-row gap-4 items-center">
                <span className="loading loading-dots loading-xl"></span>
                <div className="text-xl font-semibold">
                    Loading
                </div>
            </div>
            <div className="text-lg">
                {messages[Math.floor(Math.random() * messages.length)]}
            </div>
        </div>
    )
}
