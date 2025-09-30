import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

const faqs = [
  {
    question: "Quem pode se cadastrar na plataforma?",
    answer: "Nossa plataforma está aberta para psicólogos, psiquiatras, terapeutas ocupacionais e outros profissionais de saúde mental com CRP válido."
  },
  {
    question: "Como funciona o processo de seleção?",
    answer: "Após o cadastro, nossa equipe revisa seus dados e documentos antes de aprovar o acesso à plataforma."
  },
  {
    question: "Quais os benefícios de ser um profissional parceiro?",
    answer: "Você terá visibilidade nacional, acesso a ferramentas exclusivas e poderá impactar positivamente vidas em todo o Brasil."
  },
  {
    question: "Existe algum custo para se cadastrar?",
    answer: "Não, o cadastro é totalmente gratuito."
  },
  {
    question: "Posso atuar como voluntário na plataforma?",
    answer: "Sim, temos espaço para profissionais que desejam atuar de forma voluntária."
  },
  {
    question: "Como a plataforma garante a segurança dos dados do paciente?",
    answer: "Todos os dados são criptografados e seguimos as normas da LGPD para proteger as informações."
  }
];

export default function FAQ() {
  return (
    <section className="max-w-10xl mx-auto px-6 py- relative bg-gradient-to-r from-blue-50 to-blue-100 p-4 pt-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Perguntas Frequentes
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Encontre respostas para as dúvidas mais comuns sobre nossa plataforma
        </p>
      </div>
      
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border-b border-gray-200 last:border-b-0"
            >
              <AccordionTrigger className="py-6 text-left font-semibold text-gray-800 hover:text-blue-600 hover:no-underline text-lg">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-gray-600 leading-relaxed text-base">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}