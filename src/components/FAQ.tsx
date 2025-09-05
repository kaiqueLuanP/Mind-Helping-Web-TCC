import { useState } from "react";

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
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="max-w-10xl mx-auto px-6 py- relative bg-gradient-to-r from-blue-50 to-blue-100 py-24 ">
      <h2 className="text-3xl font-bold text-black mb-6">Perguntas Frequentes</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-700 rounded-lg bg-gray-900/50 backdrop-blur-sm">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full text-left px-4 py-3 font-medium text-gray-200 flex  justify-between hover:text-white transition-colors"
            >
              {faq.question}
              <span>{openIndex === index ? "−" : "+"}</span>
            </button>
            {openIndex === index && (
              <p className="px-4 pb-4 text-gray-300 mt-2 mb-[-10px]">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
