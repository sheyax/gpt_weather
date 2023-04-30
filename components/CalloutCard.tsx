'use client'

import { Callout } from "@tremor/react"
import { CheckCircleIcon, ExclamationIcon } from "@heroicons/react/solid"

type Props= {
    message: string;
    warning?: string;
}
function CalloutCard ({message, warning}:Props){

    return (
        <div>
            <Callout
            className="mt-4"
            title={message}
            icon={warning? ExclamationIcon: CheckCircleIcon}
            color={warning? "rose": "teal"}
            />

        </div>
    )
}

export default CalloutCard