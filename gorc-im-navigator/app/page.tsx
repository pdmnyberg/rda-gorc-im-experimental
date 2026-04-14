"use client"
import { Tree } from "@/components/Tree";
import { Panels } from "@/components/Panels";

export default function Home() {
  return (
    <div className="tree-container d-flex flex-column align-self-stretch">
      <Panels />
      <div className="flex-grow-1 flex-shrink-1">
        <Tree />
      </div>
    </div>
  )
}
