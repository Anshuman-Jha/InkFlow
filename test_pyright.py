import operator
from typing import TypedDict, List, Annotated
from pydantic import BaseModel, Field

class Task(BaseModel):
    id: int
    title: str

class Plan(BaseModel):
    tasks: List[Task]

class State(TypedDict):
    plan: Plan
    sections: Annotated[List[str], operator.add]

    """
    This is a test
    <langgraph.graph.state.CompiledStateGraph object at 0x11023eba0>
    """
