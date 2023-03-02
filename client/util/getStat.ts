import { StoryPoint } from "@/context/RoomContext"
import votingOption from "../data/VotingOption.json"

export function getStat(
  storyPoints: (StoryPoint | undefined)[],
  votingSystem: "fibonacci" | "modifiedFibonacci"
) {
  const numericalStoryPoints = storyPoints.filter(
    Number.isFinite
  ) as number[]
  const numericalVotingOptions = votingOption[votingSystem].filter(
    Number.isFinite
  ) as number[]
  if (numericalStoryPoints.length === 0) {
    return { average: "?", result: "?" }
  }
  const total = numericalStoryPoints.reduce(
    (total, currentValue) => total + currentValue,
    0
  )
  const average =
    Math.round((total / numericalStoryPoints.length) * 10) / 10

  const closestPoint = numericalVotingOptions.reduce((prev, curr) =>
    Math.abs(prev - average) < Math.abs(curr - average) ? prev : curr
  )
  return { average: average, result: closestPoint }
}
