"use client"

import { Children, type ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

const easeOut = [0.23, 1, 0.32, 1] as const

interface HomeRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  distance?: number
}

interface HomeRevealGroupProps extends HomeRevealProps {
  itemClassName?: string
  stagger?: number
}

function HomeReveal({
  children,
  className,
  delay = 0,
  distance = 24,
}: HomeRevealProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.18, margin: "0px 0px -6% 0px" }}
      transition={{ duration: 0.78, delay, ease: easeOut }}
    >
      {children}
    </motion.div>
  )
}

function HomeRevealGroup({
  children,
  className,
  delay = 0,
  distance = 20,
  itemClassName,
  stagger = 0.12,
}: HomeRevealGroupProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: false, amount: 0.14, margin: "0px 0px -5% 0px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: reduceMotion ? 0 : stagger,
          },
        },
      }}
    >
      {Children.map(children, (child) => (
        <motion.div
          className={cn("h-full", itemClassName)}
          variants={{
            hidden: {
              opacity: 0,
              y: distance,
              transition: { duration: 0.62, ease: easeOut },
            },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.72, ease: easeOut },
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

export { HomeReveal, HomeRevealGroup }
