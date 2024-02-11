import _ from "lodash"
import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/lib/components/Accordion"
import { Card, CardContent } from "~/lib/components/Card"
import report from "~/lib/report"
import { getRulesCount, parseRules } from "~/lib/rules"
import type { Rules as IRules } from "~/lib/types"

function Rules() {
  const [rules, setRules] = useState<IRules>({})
  useEffect(() => {
    sendToBackground({
      name: "requestDisplayedRules",
    }).then((res) => setRules(parseRules(res, true)))
    report({
      name: "options-rules",
    })
  }, [])

  const [count, setCount] = useState(0)
  useEffect(() => {
    setCount(getRulesCount(rules))
  }, [rules])

  return (
    <div>
      <h1 className="text-3xl font-medium leading-10 mb-6 text-primary border-b pb-4">
        {chrome.i18n.getMessage("rules")}
      </h1>
      <div className="content mb-6 space-y-2">
        <p>
          {chrome.i18n.getMessage("totalNumberOfRules")}: {count}
        </p>
        <p
          dangerouslySetInnerHTML={{
            __html: chrome.i18n.getMessage("forMoreRulesJoinUs"),
          }}
        ></p>
      </div>
      <div className="space-y-4">
        <Card>
          <CardContent>
            {Object.keys(rules).map((key) => {
              const rule = rules[key]
              return (
                <div key={key}>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        <div className="font-medium">
                          {rule._name} - {key}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {Object.keys(rule).map((item) => {
                            const subdomainRules = rule[item]
                            if (Array.isArray(subdomainRules)) {
                              return subdomainRules.map(
                                (subdomainRule, index) => {
                                  return (
                                    <div key={key + item + index}>
                                      <div className="flex items-center space-x-2">
                                        <div className="flex-1">
                                          <p className="text-sm text-foreground/70">
                                            {subdomainRule.title}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                },
                              )
                            } else {
                              return null
                            }
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export { Rules }
