const Part = ({ part }) => {
  return (
    <p key={part.id}>
      {part.name} {part.exercises}
    </p>
  )
}

const Content = ({ parts }) => {
  return (
   <>
     <Part part={parts[0]} />
     <Part part={parts[1]} />
     <Part part={parts[2]} />
   </>
  )
}

export default Content;