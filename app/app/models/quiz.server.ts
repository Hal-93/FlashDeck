import { List, Quiz } from "@prisma/client";
import { prisma } from "~/db.server";

export async function getAllLists() {
    return await prisma.list.findMany({
        include: {
            quizzes: true,
        },
    });
}

export async function addList(name: string) {
    return await prisma.list.create({
        data: { name },
    });
}

export async function deleteList(id: List["id"]) {
    return await prisma.list.delete({
        where: { id },
        include: {
            quizzes: true,
        },
    });
}

export async function getList(id: List["id"]) {
    return await prisma.list.findUnique({
        where: { id },
        include: {
            quizzes: true,
        },
    });
}

export async function updateList(id: List["id"], name: string) {
    return await prisma.list.update({
        where: { id },
        data: { name },
    });
}

export async function getQuizzes() {
    return await prisma.quiz.findMany({});
}

export async function addQuiz(
    problem: Quiz["problem"],
    answer: Quiz["answer"],
    listId: number
) {
    return await prisma.quiz.create({
        data: { 
            problem, 
            answer,
            listId,
            isChecked: false
        },
    });
}

export async function deleteQuiz(id: Quiz["id"]) {
    return await prisma.quiz.delete({
        where: { id },
    });
}

export async function updateQuiz(
    id: Quiz["id"],
    problem: string,
    answer: string,
    isChecked: boolean
  ) {
    return await prisma.quiz.update({
      where: { id },
      data: { problem, answer, isChecked },
    });
  }
  
  export async function toggleQuizChecked(id: Quiz["id"]) {
    const quiz = await prisma.quiz.findUnique({
        where: { id },
        select: { isChecked: true }
    });

    if (!quiz) {
        throw new Error(`Quiz with ID ${id} not found`);
    }

    return await prisma.quiz.update({
        where: { id },
        data: { isChecked: !quiz.isChecked },
    });
}